from route import *
import os
if __name__ == '__main__':
    filename = "KEY_NAME"
    #os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.abspath(f'../{filename}')
    app.run(port=8000, debug=True)