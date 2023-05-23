class Config:
    SECRET_KEY='j!oS2ODa1JUMaY*%ALX'

class DevelopmentConfig(Config):
    DEBUG=True
    MYSQL_HOST='localhost'
    MYSQL_USER='root'
    MYSQL_PASSWORD='2wDu]UX51qugr.IU'
    MYSQL_DB='flask_login'

config={
        'development':DevelopmentConfig
    }