import os
import configparser

key_praser = configparser.ConfigParser()
key_praser.read("credentials.ini")

filename = key_praser.get("credentials", "key_path")
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.abspath(f'../{filename}')