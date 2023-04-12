from credentials import *
from flask import Flask, render_template, redirect, jsonify
from google.cloud import translate_v2 as translate
from google.cloud import texttospeech
from google.cloud import storage
from google.cloud import firestore
from newspaper import Article


app = Flask(__name__)

#================================================================================================
#                                change according to your project id
#================================================================================================

PROJECT_ID = 'team5project'
BUCKET_NAME = 'translate_speech'
FIRESTORE_COLLECTION = 'articles'

#================================================================================================


#firestore client
db = firestore.Client(project=PROJECT_ID)
#google cloud storage client and bucket
storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)

#google cloud texttospeech client
texttospeech_client = texttospeech.TextToSpeechClient()
#google cloud translate client
translate_client = translate.Client()


#supported languages and their codes
dict = {
    "English":      {"byte": 1, "code": "en","code_region": "en-US"},
    "German":       {"byte": 1, "code": "de","code_region": "de-DE"},
    "Spanish":      {"byte": 1, "code": "es","code_region": "es-ES"},
    "Franch":       {"byte": 1, "code": "fr","code_region": "fr-FR"},
    "Italian":      {"byte": 1, "code": "it","code_region": "it-IT"},
    "Dutch":        {"byte": 1, "code": "nl","code_region": "nl-NL"},
    "Portuguese":   {"byte": 1, "code": "pt","code_region": "pt-PT"},
    "Swedish":      {"byte": 1, "code": "sv","code_region": "sv-SE"},
    "Danish":       {"byte": 1, "code": "da","code_region": "da-DK"},
    "Norwegian":    {"byte": 1, "code": "no","code_region": "nb-NO"},
    "Finnish":      {"byte": 1, "code": "fi","code_region": "fi-FI"},
    "Icelandic":    {"byte": 1, "code": "is","code_region": "is-IS"},
}

@app.route('/')
def index():
    #this url is for testing purpose, will change to user input url later
    url = "https://www.cnn.com/2023/03/28/tech/elon-musk-verified-only-for-you-feed"
    #scraping article from the url
    article = Article(url)
    article.download()
    article.parse()
    original_text = article.text
    
    #in the scraped text, there are some \n which are not needed, so replacing them with space
    original_text = original_text.replace("\n"," ")
    
    #doing translation on original text, here we are translating to french. later we will change this to user input language
    result = translate_client.translate(original_text, target_language='fr')
    translated_text = result['translatedText']

    
    #doing texttospeech on translated text
    synthesis_input = texttospeech.SynthesisInput(text=translated_text)
    
    #here we are using french voice. later we will change this to user input language
    voice = texttospeech.VoiceSelectionParams(
        language_code="fr-FR", ssml_gender=texttospeech.SsmlVoiceGender.MALE
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    response = texttospeech_client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    audio = response.audio_content
    
    #add texttospeech audio to google cloud storage bucket
    filename = f'{article.title}.mp3'
    blob = bucket.blob(filename)
    blob.upload_from_string(audio, content_type='audio/mp3')
    
    #add data to firestore
    #here we are adding original text, translated text, audio filename and audio url to firestore, we can add more data if needed
    db.collection(FIRESTORE_COLLECTION).document(f'{article.title}').set({
    u'original_text': original_text,
    u'translated_text': str(translated_text),
    u'audio_filename': filename,
    u'audio_url': f'https://storage.googleapis.com/{BUCKET_NAME}/{filename}',
    },merge=True)
    
    #this loop is for testing purpose, will remove later
    """
    # For getting data from firestore
    
    query = db.collection(u'articles').stream()
    for q in query:
        x = q.to_dict()
    """
    return "SUCCESS",200

#this route is for getting data from firestore
@app.route('/get_article/<title>')
def get_article(title):
    doc_ref = db.collection(u'articles').document(title)
    doc = doc_ref.get()
    if doc.exists:
        return jsonify(doc.to_dict()),200
    else:
        return "Not Found",404
    
#this route is for getting image from google cloud storage
@app.route('/images/<image_name>')
def serve_image(image_name):
    blob = bucket.blob(image_name)
    image = blob.download_as_bytes()
    return image, {'Content-Type': blob.content_type}

#this route is for getting audio from google cloud storage
@app.route('/audio/<audio_name>')
def serve_audio(audio_name):
    blob = bucket.blob(audio_name)
    audio = blob.download_as_bytes()
    return audio, {'Content-Type': blob.content_type}