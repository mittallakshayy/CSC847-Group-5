from credentials import *
from flask import Flask, render_template, redirect, jsonify
from google.cloud import translate_v2 as translate
from google.cloud import texttospeech
from google.cloud import storage
from google.cloud import firestore
from newspaper import Article


app = Flask(__name__)
#change according to your project id
PROJECT_ID = 'team5project'
BUCKET_NAME = 'translate_speech'
FIRESTORE_COLLECTION = 'articles'

db = firestore.Client(project=PROJECT_ID)

@app.route('/')
def index():
    url = "https://www.cnn.com/2023/03/28/tech/elon-musk-verified-only-for-you-feed"
    
    #scraping article from the url
    article = Article(url)
    article.download()
    article.parse()
    original_text = article.text
    original_text = original_text.replace("\n"," ")
    
    translate_client = translate.Client()
    result = translate_client.translate(original_text, target_language='fr')
    translated_text = result['translatedText']

    
    #doing texttospeech on translated text
    texttospeech_client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=translated_text)
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
    storage_client = storage.Client()
    bucket = storage_client.bucket(BUCKET_NAME)
    filename = f'{article.title}.mp3'
    blob = bucket.blob(filename)
    blob.upload_from_string(audio, content_type='audio/mp3')
    
    db.collection(FIRESTORE_COLLECTION).document(f'{article.title}').set({
    u'original_text': original_text,
    u'translated_text': str(translated_text),
    u'audio_filename': filename
    },merge=True)
    """
    # For getting data from firestore
    
    query = db.collection(u'articles').stream()
    for q in query:
        x = q.to_dict()
    """
    return "SUCCESS",200

