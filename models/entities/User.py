from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import UserMixin
class User(UserMixin):
    def __init__(self,id,username,password,name="",last_name="") -> None:
        self.id=id
        self.username=username
        self.password=password
        self.name=name
        self.last_name=last_name
    @classmethod
    def check_password(sefl,hashed_password,password):
        return check_password_hash(hashed_password,password)
##print(generate_password_hash("JobStarPro"))