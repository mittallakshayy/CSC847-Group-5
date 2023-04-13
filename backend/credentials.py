import os

filename = "team5project-e18047e95931.json"
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.abspath(f'../{filename}')