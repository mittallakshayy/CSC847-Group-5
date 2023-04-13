from credentials import *
from flask import Flask, render_template, redirect, jsonify, request
from google.cloud import translate_v2 as translate
from google.cloud import texttospeech
from google.cloud import storage
from google.cloud import firestore
from newspaper import Article
import urllib.request

app = Flask(__name__)

# ================================================================================================
#                                change according to your project id
# ================================================================================================

PROJECT_ID = "team5project"
BUCKET_NAME = "translate_speech"
FIRESTORE_COLLECTION = "articles"

# ================================================================================================


# firestore client
db = firestore.Client(project=PROJECT_ID)
# google cloud storage client and bucket
storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)

# google cloud texttospeech client
texttospeech_client = texttospeech.TextToSpeechClient()
# google cloud translate client
translate_client = translate.Client()


# supported languages and their codes
dict = {
    "english": {"language": "english", "code": "en", "code_region": "en-US"},
    "german": {"language":"german", "code": "de", "code_region": "de-DE"},
    "spanish": {"language":"spanish", "code": "es", "code_region": "es-ES"},
    "franch": {"language":"franch", "code": "fr", "code_region": "fr-FR"},
    "italian": {"language":"italian", "code": "it", "code_region": "it-IT"},
    "dutch": {"language":"dutch", "code": "nl", "code_region": "nl-NL"},
    "portuguese": {"language":"portuguese", "code": "pt", "code_region": "pt-PT"},
    "swedish": {"language":"swedish", "code": "sv", "code_region": "sv-SE"},
    "danish": {"language":"danish", "code": "da", "code_region": "da-DK"},
    "norwegian": {"language":"norwegian", "code": "no", "code_region": "nb-NO"},
    "finnish": {"language":"finnish", "code": "fi", "code_region": "fi-FI"},
    "icelandic": {"language":"icelandic", "code": "is", "code_region": "is-IS"},
}

# ================================================================================================
                                        #TODO
# ================================================================================================

#this function fetch 5-10 news from CNN, translate it, doing text to speech and upload to google cloud storage and firestore
def init():
    return
    

"""
this method recieve url, language from frontend.
download news from url, translate it, doing text to speech
and upload to google cloud storage and firestore
"""
@app.route("/upload", methods=["POST"])
def upload():
    #get url, target-language from frontend
    url = request.form['url']
    language = request.form['language'].lower()
    
    #scraping news from url
    article = Article(url)
    article.download()
    article.parse()
    original_text = article.text
    original_text = original_text.replace("\n", " ")
    
    # doing translation on original text
    result = translate_client.translate(original_text, target_language=dict[language]["code"])
    translated_text = result["translatedText"]
    # doing texttospeech on translated text
    synthesis_input = texttospeech.SynthesisInput(text=translated_text[:4800])
    voice = texttospeech.VoiceSelectionParams(
        language_code=dict[language]["code_region"], ssml_gender=texttospeech.SsmlVoiceGender.MALE
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    
    response = texttospeech_client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    audio = response.audio_content
    
    # add texttospeech audio to google cloud storage bucket
    filename = f"{article.title}_{language}.mp3"
    blob = bucket.blob(filename)
    blob.upload_from_string(audio, content_type="audio/mp3")
    
    # add image to google cloud storage bucket if url is valid
    imagename = f"{article.title}.jpg"
    with urllib.request.urlopen(article.top_image) as img_url:
        blob = bucket.blob(imagename)
        blob.upload_from_string(img_url.read(), content_type="image/jpg")
        
    # add data to firestore
    db.collection(FIRESTORE_COLLECTION).document(f"{article.title}").set(
        {
            "title": article.title,
            "author": article.authors,
            "publish_date": article.publish_date,
            "original_text": original_text,
            f"translated_text_{language}": str(translated_text),
            f"audio_filename_{language}": filename,
            f"audio_url_{language}": f"https://storage.googleapis.com/{BUCKET_NAME}/{filename}",
            "image_filename": imagename,
            "image_url": f"https://storage.googleapis.com/{BUCKET_NAME}/{imagename}",
            "category": url.split('/')[-2]
        },
        merge=True,
    )
    # return data to frontend
    doc_ref = db.collection("articles").document(article.title)
    doc = doc_ref.get()
    if doc.exists:
        return jsonify(doc.to_dict()), 200
    else:
        return "Not Found", 404

"""
this method translate and doing text-to-speech on language that not exist in firestore
it will upload text-to-speech to google cloud storage
also update the firestore with new translated language
"""
@app.route("/add_language", methods=["POST"])
def add_language():
    #get title, target-language from frontend
    title = request.form['title']
    language = request.form['language'].lower()
    
    #get document from firestore
    doc_ref = db.collection("articles").document(title)
    doc = doc_ref.get()
    if doc.exists:
        exist_doc = jsonify(doc.to_dict())
    else:
        return "Not Found", 404
    
    #declare variable for translation and text-to-speech
    original_text = exist_doc.json['original_text']
    title = exist_doc.json['title']
    
    # doing translation on original text
    result = translate_client.translate(original_text, target_language=dict[language]["code"])
    translated_text = result["translatedText"]
    # doing texttospeech on translated text
    synthesis_input = texttospeech.SynthesisInput(text=translated_text[:4800])
    voice = texttospeech.VoiceSelectionParams(
        language_code=dict[language]["code_region"], ssml_gender=texttospeech.SsmlVoiceGender.MALE
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    
    response = texttospeech_client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    audio = response.audio_content
    
    # add texttospeech audio to google cloud storage bucket
    filename = f"{title}_{language}.mp3"
    blob = bucket.blob(filename)
    blob.upload_from_string(audio, content_type="audio/mp3")
        
    # add new translated text, audio name, audio url to firestore
    doc_ref.update(
        {
            f"translated_text_{language}": str(translated_text),
            f"audio_filename_{language}": filename,
            f"audio_url_{language}": f"https://storage.googleapis.com/{BUCKET_NAME}/{filename}",
        })
    # return data to frontend
    doc = doc_ref.get()
    if doc.exists:
        return jsonify(doc.to_dict()), 200
    else:
        return "Not Found", 404
    

# this route is for getting image from google cloud storage
@app.route("/images/<image_name>")
def get_image(image_name):
    blob = bucket.blob(image_name)
    image = blob.download_as_bytes()
    return image, {"Content-Type": blob.content_type}

# this route is for getting audio from google cloud storage
@app.route("/audio/<audio_name>")
def get_audio(audio_name):
    blob = bucket.blob(audio_name)
    audio = blob.download_as_bytes()
    return audio, {"Content-Type": blob.content_type}


# this route is for getting data from firestore
@app.route("/get_article/<title>")
def get_article(title):
    doc_ref = db.collection("articles").document(title)
    doc = doc_ref.get()
    if doc.exists:
        return jsonify(doc.to_dict()), 200
    else:
        return "Not Found", 404



# this route is for serving index page
@app.route("/index")
def get_index():
    doc_ref = db.collection("articles").stream()
    document = []
    for doc in doc_ref:
        document.append(doc.to_dict())
    return document, 200


