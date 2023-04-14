# CSC847-Group-5

## Backend Route

### /upload/ Method = [POST] 
- body: form
    - url
    - language\
    This route use to upload new article to our database\

### /add_language/ Method = [POST]
- body: form
    - title
    - language\
    This route use to add new language to our database\

### /images/<image_name> Method = [GET]
- ```ex: localhost:8000/images/<image_name>```
    - param:
        - image_name\
    This route use to get image from Google cloud storage\

### /audio/<audio_name> Method = [GET]
- ```ex: localhost:8000/audio/<audio_name>```
    - param:
        - audio_name\
    This route use to get audio from Google cloud storage\

### /get_article/<title> Method = [GET]
- ```ex: localhost:8000/get_article/<title>```
    - param:
        - title\
    This route use to get specific document from firestore\

### /index/ Method = [GET]
- ```ex: localhost:8000/index/```
    This route use to get all document from firestore\
    \
- ```optional```\
    ### ```/index/<category> Method = [GET]```
        - param:
            - category\
    This route use to get all document from firestore that have specific category\

### /index/<category> Method = [GET]
- ```ex: localhost:8000/index/tech```\
    - param:
        - category\
    This route use to get all document from firestore that have specific category\

### /get_language/ Method = [GET]
- ```ex: localhost:8000/get_language/```\
    This route use to get all language supported by backend\
 
### /get_category/ Method = [GET]
- ```ex: localhost:8000/get_category/```\
    This route use to get all distinct category in firestore document\

### /delete_article/<title> Method = [GET]
- ```ex: localhost:8000/delete_article/<title>```
    - param:
        - title\
    This route use to delete specific news from firestore and all related file\