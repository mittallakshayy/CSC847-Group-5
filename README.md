# CSC847-Group-5

## Backend SETUP

### Service account setup
- Create service account in GCP 
- Create json key of that service account and place in this directory
- open backend/credentails.py, replace your filename with your "KEY_NAME"
- uncomment this line
    - #os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.abspath(f'../{filename}')

### Library setup
- Install all library in requirement.txt\
    ```pip install -r requirement.txt```

### variable setup
- Go to app.py, Change these variable according to your project
    - PROJECT_ID
    - BUCKET_NAME
    - FIRESTORE_COLLECTION

### run
- run python3 app.py
