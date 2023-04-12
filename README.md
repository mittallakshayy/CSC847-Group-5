# CSC847-Group-5

# Backend SETUP
- Create service account in GCP 
- Create json key of that service account and place in this directory
- open backend/app.py, replace your filename with your "KEY_NAME"
- uncomment this line
    -     #os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.abspath(f'../{filename}')

- Install all library in requirement.txt
- run python3 app.py