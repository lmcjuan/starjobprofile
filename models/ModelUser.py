from .entities.User import User
class ModelUser():
    @classmethod # Para utilizar el metodo sin instanciar la clase Model User
    def login(self,db,user):
        try:
            cursor=db.connection.cursor()
            sql="""SELECT id, username, password, name, last_name FROM user 
            WHERE username='{}'""".format(user.username)
            cursor.execute(sql)
            row=cursor.fetchone()
            if row != None:
                user=User(row[0],row[1],User.check_password(row[2],user.password),row[3],row[4])
                return user
            else: 
                return None
        except Exception as ex:
            raise Exception(ex)
    @classmethod # Para utilizar el metodo sin instanciar la clase Model User
    def get_by_id(self,db,id):
        try:
            cursor=db.connection.cursor()
            sql="""SELECT id, username, name, last_name FROM user 
            WHERE id='{}'""".format(id)
            cursor.execute(sql)
            row=cursor.fetchone()
            if row != None:
                logged_user=User(row[0],row[1],None,row[2],row[3])
                return logged_user
            else: 
                return None
        except Exception as ex:
            raise Exception(ex)