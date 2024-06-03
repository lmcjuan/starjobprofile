from flask import Flask,request ,send_file, jsonify,redirect,url_for, render_template,flash
from flask_login import LoginManager, login_user,logout_user,login_required
from flask_mysqldb import MySQL
import pandas as pd
import csv
import random
import nltk
import re
import requests,uuid,json
from nltk.tokenize import RegexpTokenizer
nltk.download('stopwords')
from nltk.corpus import stopwords
tokenizer=RegexpTokenizer("\w+")
import numpy
import joblib
from config import config

from models.ModelUser import ModelUser
from models.entities.User import User
#from libretranslatepy import LibreTranslateAPI
#from urllib import request, parse

app= Flask(__name__)
db=MySQL(app)
Loginmanager_app=LoginManager(app)
@Loginmanager_app.user_loader
def load_user(id):
    return ModelUser.get_by_id(db,id)

################################### Login #################################

@app.route('/Dashboard/')
def homeuser():
    return redirect(url_for('login'))

@app.route('/login',methods=['GET','POST'])
def login():
    #Si el sitio web envía información#
    if request.method == 'POST':
        #Los datos recibidos se envían al constructor de usuarios#
        user= User(0,request.form['Username'],request.form['Key'])
        #Se verifica que el usuario existe en la base de datos#
        logged_user=ModelUser.login(db,user)
        if(logged_user!=None):
            #Se verifica que el la contraseña ingresada coincide con la que está encriptada en la base de datos#
            if logged_user.password:
                 #Si se validan con éxito se da acceso a los métodos restingidos#
                login_user(logged_user)
                print("Acceso!!")
                #Redirige a la pantalla inicial de funciones privilegiadas#
                return redirect(url_for('Dashboard'))
            else:
                #Envía al Frontend el mensajede error#
                flash("La contraseña es incorrecta")
                return render_template('Login.html')
        else:
            flash("El nombre de usuario es incorrecto")
            return render_template('Login.html')

    else:
        #Si el método es GET solicita datos se envía el archivo de Login#
        return render_template('Login.html')
 

################################################### Ruta raíz  #################
@app.get('/')
def home():
    return send_file("static/index.html")
################################################### Ruta para realizar el test DISC clásico #################
@app.get('/Test/')
def test():
    return send_file("static/Test/Test.html")
################################################### Guaradar un perfil en el dataset  #################
@app.post('/api/dataset')
def get_data():
    datos=pd.read_csv('Dataset.csv',header=0)
    df=pd.DataFrame(datos)
    #Se obtienen los datos en formato JSON#
    new_data=request.get_json()
    ID = new_data['Id']
    Tipo= new_data['Tipo']
    TextUser=str(new_data['TextUser'])
    Timer=new_data['Timer']
    Txtime=new_data['Txtimer']
    print("Lo que llego del html "+ID,Tipo,TextUser,Timer,Txtime)
    print("DataFrame Original")
    print(df)
    #Guarda los datos directamente en el Dataframe#
    with open("Dataset.csv","a",newline="",encoding='utf-8') as File:
        writer = csv.writer(File)
        writer.writerow([ID,Tipo,TextUser,Timer,Txtime])
        File.close()
    return 'DataFrame Editado'

################################################### Clasificacón función SVM #################

@app.get('/api/Candidatos')
def Candidatos():
    return send_file("static/SVM/SVM.html")
################################################### Guarda los datos de un solicitante #################
@app.post('/api/Save')
def savedata():
    print("Guardando")
    dataf=pd.read_csv('Dataset.csv',header=0)
    dffm=pd.DataFrame(dataf)
    new_user=request.get_json()
    Nombre=new_user['Name_user']
    Last_name=new_user['Last_name']
    idU=new_user['IDU']
    idP=int(len(dffm))+1
    prcen=new_user['Prob']
    puesto=new_user['puesto']
    phone=new_user['phone']
    exper=new_user['exper']
    correo=new_user['correo']
    perf=new_user['perf']
    with open("UserData.csv","a",newline="",encoding='utf-8') as File:
        writer = csv.writer(File)
        writer.writerow([idP,idU,Nombre,Last_name,puesto,correo,perf,prcen,phone,exper])
        File.close()
    print("Success!!")
    return 'Usuario Agregado'
################################################### Clasificacón modelo SVM #################
@app.get('/api/classification/<Text>')
def svmachines(Text):
    #Recibe el texto escrito en lenguaje natural como un objeto#
    print("Datos obtenidos")
    print(Text)
    text=[Text]
    #CSV con teoría acerca del modelo DISC#
    datosdi=pd.read_csv('DISCPP.csv',header=0)
    dfd=pd.DataFrame(datosdi)
    #Importando modelo previamente entrenado#
    pipeline_model=joblib.load('SVM1.pkl')
    #Ingresando el texto para ser preocesado#
    prediccion= pipeline_model.predict(text)
    #El número resultante es correspondiente al tipo de perfil#
    print(prediccion[0])
    #la variable dat_txt guarda la descripción del tipo de perfil#
    dat_txt=dfd.loc[prediccion[0],'TextDISC']
    # data_t almacena el tipo de perfil#
    data_t=dfd.loc[prediccion[0],'Tipo']
    predicciones=pipeline_model.decision_function(text)
    #Devuelve el porcentaje de pertenencia al perfil resultante#
    print(predicciones[0])
    l=int((predicciones[0][prediccion[0]])*100)
    print(l,"%")
    #Envía los resultados al cliente en formato JSON# 
    return jsonify({'TextUser':dat_txt,'Tipo':data_t,'prc':l,'idU':int(prediccion[0])})

   
@app.route('/Dashboard')
  #Esta función limita el acceso a usuarios que no se han autenticado# 
@login_required
def Dashboard():
    print("Dashboard")
    return render_template('Dashboard.html')
@app.get('/api/Dashboard/')
@login_required
def Dashboardget():
    #Lee el archivo con todos los datos de los aspirantes#
    dataUsr=pd.read_csv('UserData.csv')
    dfUsr=pd.DataFrame(dataUsr)
    datausers=[]
    #Guarda los datos de cada aspirante en un objeto#
    for h in range(0,len(dfUsr)):
        idpersona = int(dfUsr.loc[h,'idPersona'])
        nombre = ""+str(dfUsr.loc[h,'Nombre'])+" "+str(dfUsr.loc[h,'LastN'])
        print(nombre)
        puesto = dfUsr.loc[h,'Puesto']
        email = dfUsr.loc[h,'Email']
        perfil = dfUsr.loc[h,'Perfil']
        Phone = str(dfUsr.loc[h,'Phone'])
        Exper = dfUsr.loc[h,'Exper']
        idperfil = int(dfUsr.loc[h,'Idperfil'])
        porcentaje = int(dfUsr.loc[h,'Porcentaje'])
        datausers.append({'idpersona':idpersona,'nombre':nombre,'puesto':puesto,'email':email,'perfil':perfil,'porcentaje':porcentaje,'idperfil':idperfil,'phone':Phone,'Exper':Exper})
    return jsonify(datausers)

@app.get('/api/Logout')
#Indica que la sesión finalizó#
def Logout():
    logout_user()
    return redirect(url_for('home'))

@app.get('/api/delete/user/<id>')
#Borrar datos#
def delete(id):
    #Recibe el ID del dato a ser eliminado#
    datUsr=pd.read_csv('UserData.csv')
    new_data=datUsr
    print(id)
    answer=int(id)
    for h in range(0,len(datUsr)):
        idpersona = int(datUsr.loc[h,'idPersona'])
        #Si el ID del dato coincide con uno del csv se elimina#
        if(answer==idpersona):
            print(new_data)
            new_data=new_data.drop(h)
            print(new_data)
            #Vuelve a escribir todos los datos#
            new_data.to_csv('UserData.csv',index=False)
    return redirect(url_for('Dashboard'))

@app.get('/api/DISC/<p>')
def DISC(p):
    #Obtiene un perfil de DISC dependiendo de su numero#
    h=int(p)
    print(h)
    dataDISC=pd.read_csv('DISCPP.csv')
    dfdisc=pd.DataFrame(dataDISC)
    nombre = dfdisc.loc[h,'Nombre']
    TextDISC = dfdisc.loc[h,'TextDISC']
    Patron = dfdisc.loc[h,'Tipo']
    D = int(dfdisc.loc[h,'D'])
    I = int(dfdisc.loc[h,'I'])
    S = int(dfdisc.loc[h,'S'])
    C = int(dfdisc.loc[h,'C'])
    Alto=Patron = dfdisc.loc[h,'Alto']
    #Regresa al frontend los datos correspondientes al perfil#
    return jsonify({'nombre':nombre,'TextDISC':TextDISC,'Patron':Patron,'D':D,'I':I,'S':S,'C':C,'Alto':Alto})

@app.get('/api/UserTxt/<pe>')
def Txt_U(pe):
    #Recibe el id de un texto escrito por un usuario previamente registrado#
    print(pe)
    datatext=pd.read_csv('Dataset.csv')
    dftxt=pd.DataFrame(datatext)
    b=int(pe)-1
    txt_user = dftxt.loc[b,'TextUser']
    #Devueleve el texto ingresado por un usuario#
    return jsonify({'txt_user':txt_user})
################################################ Perfiles página principal ############################
@app.route('/api/Puestos')
@login_required
def Puestos():
    
    return send_file("static/Puestos/Jobs.html")
#Recibe los datos de una nueva vacante#
@app.post('/api/Vacante')
def Guaradar_Puestos():
    datos=pd.read_csv('static/Users/Vacantes.csv',header=0)
    dfPues=pd.DataFrame(datos)
    idV=len(dfPues)
    #Se asigan un ID para poder eliminar#
    print("El id que se va asignar al puesto es : "+str(idV))
    #Obtiene los datos del formulario del Frontend#
    request.form
    D = request.form['D']
    I = request.form['I']
    S = request.form['S']
    C = request.form['C']
    P = request.form['P']
    Puesto= request.form['Puesto']
    Exp=request.form['Exp']
    Esc=request.form['Esc']
    DescPues=request.form['DescPues']
    #Guarda los tados de la vacante en un CSV#
    with open("static/Users/Vacantes.csv","a",newline="",encoding='utf-8') as File:
        writer = csv.writer(File)
        writer.writerow([idV,D,I,S,C,P,Puesto,Exp,Esc,DescPues])
        File.close()
    return render_template('Dashboard.html')



@app.get('/api/Puestos/')
@login_required
def View_Puestos():
    #Lee el archivo de los puestos de trabajo#
    Vr=pd.read_csv('static/Users/Vacantes.csv')
    dfVac=pd.DataFrame(Vr)
    datausers=[]
    #Guarda todos los puestos de trabajo disponibles en una lista#
    for v in range(0,len(dfVac)):
        idV = int(dfVac.loc[v,'idV'])
        D = dfVac.loc[v,'D']
        I = dfVac.loc[v,'I']
        S = dfVac.loc[v,'S']
        C = dfVac.loc[v,'C']
        P = dfVac.loc[v,'P']
        Puesto = dfVac.loc[v,'Puesto']
        Exp = dfVac.loc[v,'Exp']
        Esc = dfVac.loc[v,'Esc']
        DescPues = dfVac.loc[v,'DescPues']
        datausers.append({'idV':idV,'D':D,'I':I,'S':S,'C':C,'P':P,'Puesto':Puesto,'Exp':Exp,'Esc':Esc,'DescPues':DescPues})
    return jsonify(datausers)



@app.get('/api/delete/vacante/<id>')
def delete_P(id):
    #Lee el archivo de los puestos de trabajo#
    datUsr=pd.read_csv('static/Users/Vacantes.csv')
    new_data=datUsr
    print(id)
    #Convierte el dato tipo objeto a entero#
    answer=int(id)
    #Busca alguna coincidencia y elimina si encuentra alguna#
    for h in range(0,len(datUsr)):
        idpersona = int(datUsr.loc[h,'idV'])
        if(answer==idpersona):
            print(new_data)
            new_data=new_data.drop(h)
            print(new_data)
            #Guarda el CSV modificado#
            new_data.to_csv('static/Users/Vacantes.csv',index=False)
    return redirect(url_for('Puestos'))

################################################ End ############################
################################################ Buscar usuario ############################

@app.post('/api/Buscar')
def Buscar():
    #Soliciata al FrontEnd los datos para buscar en todos los CSV#
    new_serch=request.get_json()
    objeto=new_serch['obj']
    buscar=str(objeto)
    print("Se va buscar "+str(buscar))
    #Lee el archivo de los usuarios registrados#
    DVr=pd.read_csv('UserData.csv')
    dfUsr=pd.DataFrame(DVr)
    datausers=[]
    for h in range(0,len(dfUsr)):
        #Busca por palabras#
        secuencia = r'(?i)\w*'+str(buscar)+'\w*'
        if(buscar==str(dfUsr.loc[h,'idPersona'])):
            idpersona = int(dfUsr.loc[h,'idPersona'])
            nombre = ""+str(dfUsr.loc[h,'Nombre'])+" "+str(dfUsr.loc[h,'LastN'])
            puesto = dfUsr.loc[h,'Puesto']
            email = dfUsr.loc[h,'Email']
            perfil = dfUsr.loc[h,'Perfil']
            Phone = int(dfUsr.loc[h,'Phone'])
            Exper = dfUsr.loc[h,'Exper']
            idperfil = int(dfUsr.loc[h,'Idperfil'])
            porcentaje = int(dfUsr.loc[h,'Porcentaje'])
            datausers.append({'idpersona':idpersona,'nombre':nombre,'puesto':puesto,'email':email,'perfil':perfil,'porcentaje':porcentaje,'idperfil':idperfil,'phone':Phone,'Exper':Exper})
        #Busca por palabras (Nombre)#
        busqueda = re.findall(secuencia,str(dfUsr.loc[h,'Nombre']))
        if (len(busqueda)!=0):
            print("Busqueda encontro palabras similares "+str(busqueda))
            idpersona = int(dfUsr.loc[h,'idPersona'])
            nombre = ""+str(dfUsr.loc[h,'Nombre'])+" "+str(dfUsr.loc[h,'LastN'])
            puesto = dfUsr.loc[h,'Puesto']
            email = dfUsr.loc[h,'Email']
            perfil = dfUsr.loc[h,'Perfil']
            Phone = int(dfUsr.loc[h,'Phone'])
            Exper = dfUsr.loc[h,'Exper']
            idperfil = int(dfUsr.loc[h,'Idperfil'])
            porcentaje = int(dfUsr.loc[h,'Porcentaje'])
            datausers.append({'idpersona':idpersona,'nombre':nombre,'puesto':puesto,'email':email,'perfil':perfil,'porcentaje':porcentaje,'idperfil':idperfil,'phone':Phone,'Exper':Exper})
        #Busca por palabras (Puesto)#
        if(buscar==str(dfUsr.loc[h,'Puesto'])):
            idpersona = int(dfUsr.loc[h,'idPersona'])
            nombre = ""+str(dfUsr.loc[h,'Nombre'])+" "+str(dfUsr.loc[h,'LastN'])
            puesto = dfUsr.loc[h,'Puesto']
            email = dfUsr.loc[h,'Email']
            perfil = dfUsr.loc[h,'Perfil']
            Phone = int(dfUsr.loc[h,'Phone'])
            Exper = dfUsr.loc[h,'Exper']
            idperfil = int(dfUsr.loc[h,'Idperfil'])
            porcentaje = int(dfUsr.loc[h,'Porcentaje'])
            datausers.append({'idpersona':idpersona,'nombre':nombre,'puesto':puesto,'email':email,'perfil':perfil,'porcentaje':porcentaje,'idperfil':idperfil,'phone':Phone,'Exper':Exper})
        #Busca por perfil id#
        if(buscar==str(dfUsr.loc[h,'Idperfil'])):
            idpersona = int(dfUsr.loc[h,'idPersona'])
            nombre = ""+str(dfUsr.loc[h,'Nombre'])+" "+str(dfUsr.loc[h,'LastN'])
            puesto = dfUsr.loc[h,'Puesto']
            email = dfUsr.loc[h,'Email']
            perfil = dfUsr.loc[h,'Perfil']
            Phone = int(dfUsr.loc[h,'Phone'])
            Exper = dfUsr.loc[h,'Exper']
            idperfil = int(dfUsr.loc[h,'Idperfil'])
            porcentaje = int(dfUsr.loc[h,'Porcentaje'])
            datausers.append({'idpersona':idpersona,'nombre':nombre,'puesto':puesto,'email':email,'perfil':perfil,'porcentaje':porcentaje,'idperfil':idperfil,'phone':Phone,'Exper':Exper})
        #Busca por perfil #
        if(buscar==str(dfUsr.loc[h,'Perfil'])):
            idpersona = int(dfUsr.loc[h,'idPersona'])
            nombre = ""+str(dfUsr.loc[h,'Nombre'])+" "+str(dfUsr.loc[h,'LastN'])
            puesto = dfUsr.loc[h,'Puesto']
            email = dfUsr.loc[h,'Email']
            perfil = dfUsr.loc[h,'Perfil']
            Phone = int(dfUsr.loc[h,'Phone'])
            Exper = dfUsr.loc[h,'Exper']
            idperfil = int(dfUsr.loc[h,'Idperfil'])
            porcentaje = int(dfUsr.loc[h,'Porcentaje'])
            datausers.append({'idpersona':idpersona,'nombre':nombre,'puesto':puesto,'email':email,'perfil':perfil,'porcentaje':porcentaje,'idperfil':idperfil,'phone':Phone,'Exper':Exper})
    return jsonify(datausers)
################################################ Buscar puesto ############################
@app.post('/api/SearchV')
def BuscarVacante():
    new_serch=request.get_json()
    objeto=new_serch['obj']
    buscar=str(objeto)
    print("Se va buscar "+str(buscar))
    DVr=pd.read_csv('static/Users/Vacantes.csv')
    dfVac=pd.DataFrame(DVr)
    datausers=[]
    for h in range(0,len(dfVac)):
        secuencia = r'(?i)\w*'+str(buscar)+'\w*'
        #Búsqueda por ID del puesto#
        if(buscar==str(dfVac.loc[h,'idV'])):
            idV = int(dfVac.loc[v,'idV'])
            D = dfVac.loc[h,'D']
            I = dfVac.loc[h,'I']
            S = dfVac.loc[h,'S']
            C = dfVac.loc[h,'C']
            P = dfVac.loc[h,'P']
            Puesto = dfVac.loc[h,'Puesto']
            Exp = dfVac.loc[h,'Exp']
            Esc = dfVac.loc[h,'Esc']
            DescPues = dfVac.loc[h,'DescPues']
            datausers.append({'idV':idV,'D':D,'I':I,'S':S,'C':C,'P':P,'Puesto':Puesto,'Exp':Exp,'Esc':Esc,'DescPues':DescPues})
        busqueda = re.findall(secuencia,str(dfVac.loc[h,'Puesto']))
        #Búsqueda por palabras (Puesto)#
        if (len(busqueda)!=0):
            print("Busqueda encontro palabras similares "+str(busqueda))
            idV = int(dfVac.loc[h,'idV'])
            D = dfVac.loc[h,'D']
            I = dfVac.loc[h,'I']
            S = dfVac.loc[h,'S']
            C = dfVac.loc[h,'C']
            P = dfVac.loc[h,'P']
            Puesto = dfVac.loc[h,'Puesto']
            Exp = dfVac.loc[h,'Exp']
            Esc = dfVac.loc[h,'Esc']
            DescPues = dfVac.loc[h,'DescPues']
            datausers.append({'idV':idV,'D':D,'I':I,'S':S,'C':C,'P':P,'Puesto':Puesto,'Exp':Exp,'Esc':Esc,'DescPues':DescPues})
    return jsonify(datausers)















################################################### Funciones de desarrollador #################33

@app.get('/csv/')
def csvfile():
    return send_file("Dataset.csv")

@app.get('/datatxt/<P>')
def textuser(P):
     st=pd.read_csv('BestAnsw.csv',header=0)
     dfe=pd.DataFrame(st)
     num = int(P)
     data=dfe.loc[num,'TextUser']
     print("El texto sacado del csv es "+ data)
     return jsonify({'TextUser':data})

@app.get('/Data/')
def Cont():
    dataframe=pd.read_csv('Dataset.csv')
    dafe=pd.DataFrame(dataframe)
    print(len(dafe))
    datanum=[]
    list=["D/I","D/S","D/C","I/D","I/S","I/C","S/D","S/I","S/C","C/D","C/I","C/S"]
    for s in range(0,12):
        n=0
        Tipo=""
        for h in range(0,len(dafe)):
            num = dafe.loc[h,'ID']
            if s == num:
                Tipo = str(dafe.loc[h,'Tipo'])
                if Tipo == list[s]:
                    n=n+1
                else:
                    print("Se encontraron datos mal etiquetados en: "+str(Tipo)+" "+str(s)+"")
                    return 'Error Data'
        datanum.append({'Tipo':Tipo,'Total':n})
    print(datanum)
    return jsonify(datanum)




@app.get('/api/traslate')
def traslate():
    return send_file("static/Traslate/Test.html")

@app.get('/api/traslate/english/<P>')
def texteng(P):

    dfeng=pd.read_csv('DatasetxtEng.csv')
    dafeng=pd.DataFrame(dfeng)
    eng=len(dfeng)
    print("La p vale "+P)
    k=int(P)
    if k != len(dfeng):
        print("La i vale ",k)
        txtEng = dafeng.loc[k,'TextUser']
        print("El texto sacado del csv es "+ txtEng)
        seg = random.randint(30,59)
        print("Los datos serán enviados dentro de ",seg,"segundos")
        print("")
        #time.sleep(seg)
        print(txtEng)
        g=len(dafeng)
        print("El texto a traducir es: "+txtEng)
        #lt = LibreTranslateAPI("https://translate.terraprint.co/")
        #TextUserSp=lt.translate(txtEng,"en","es")
        key = "81ff8896bff74965a037c815dc32b359"
        endpoint = "https://api.cognitive.microsofttranslator.com/"

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
        location = "global"
        path = '/translate'
        constructed_url = endpoint + path
        params = {
            'api-version': '3.0',
            'from': 'en',
            'to': ['es']
            }
        headers = {
            'Ocp-Apim-Subscription-Key': key,
    # location required if you're using a multi-service or regional (not global) resource.
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': str(uuid.uuid4())
            }

# You can pass more than one object in body.
        body = [{
            'text': txtEng
        }]
        request = requests.post(constructed_url, params=params, headers=headers, json=body)
        response = request.json()
        r=json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': '))
        m=json.loads(r)
        pp=""
        TextUserSp=""
        for item in m:
            pp=item["translations"]
        for j in pp:
            print(j["text"])
            TextUserSp=j["text"]
        print("El texto traducido es : ")
        print(TextUserSp)
        texto= tokenizer.tokenize(TextUserSp)
        stop=stopwords.words('spanish')
        st_txt = [word for word in texto if word not in stop]
        dataframe=pd.read_csv('Dataset-Copy1.csv')
        dafem=pd.DataFrame(dataframe)
        
        lista={'Coincidencias':'','id':'','Tipo':'','TextUser':''}
        perfil=[]
        for s in range(0,12):
            n=0
            for h in range(0,len(dafem)):
                txt = dafem.loc[h,'TextUser']
                idd=dafem.loc[h,'ID']
                Tipo=dafem.loc[h,'Tipo']
                palabras=[]
                listapalabras=['personas','puntos','fuertes','persona','Mis','mis','mi','debilidad','fortaleza','debilidades','fortalezas','Debilidad','Fortaleza','Debilidades','Fortalezas','gusta', 'gustan', 'y', 'es', 'que', 'soy', 'un','si','muy','Y','en','con', 'una','de','me','Mi', 'Soy','hay']
                if s == idd:
                    for b in range(0,len(st_txt)):
                        secuencia = r'(?i)\w*'+str(st_txt[b])+'\w*'
                        busqueda = re.findall(secuencia,txt)
                        if len(busqueda)!=0:
                            for j in range(0,len(busqueda)):
                                if(not(busqueda[j] in palabras)) and (not(busqueda[j] in listapalabras)):
                                    palabras.append(busqueda[j])
                                    n=len(palabras)
                    if n>=1:
                        perfil.append({'Coincidencias':n,'id':idd,'Tipo':Tipo,'TextUser':txt,'Palabras':palabras})
                        palabras=[]
                        n=0
        num=[]
        mayor=[] 
        fail=False
        def sacapr(b):
            if len(num) >= 0:
                for i in range(0,len(num)-1):
                    if b == num[i]:
                        num.pop(i)
                        return False
                else:
                    return True
        for kf in perfil:
            v=kf["Coincidencias"]
            num.append(int(v))
        while(len(num)!=0)and(not fail):
            Max=(numpy.max(num))
            fail=sacapr(Max)
            mayor.append(Max)
        if mayor[0]<=3:
            print("Este texto se envió a excepciones!")
            with open("Exceptions.csv","a",newline="",encoding='utf-8') as File:
                writer = csv.writer(File)
                writer.writerow([TextUserSp])
                File.close()
        else:
            def buscar():
                for p in range(0,12):
                    for n in perfil:
                        coin=n["Coincidencias"]
                        if coin == mayor[0]:
                            return n
            print("respuesta")
            print("")
            print(TextUserSp)
            print("")
            print("resultados de mayor coincidencia")
            print("")
            final= buscar()
            print(final)
            ID = str(final['id'])
            Tipo= str(final['Tipo'])
            TextUser=str(TextUserSp)
            Timer=str('0:0')
            Txtime=str('0:0')
            with open("Datacollect.csv","a",newline="",encoding='utf-8') as File:
                writer = csv.writer(File)
                writer.writerow([ID,Tipo,TextUser,Timer,Txtime])
                File.close()
            print("Se etiqueto el texto ",k)
        return jsonify({'txtEng':txtEng,'g':g,'TextUserSp':TextUserSp,'Tipo':Tipo,'time':seg})
    else:
        print("Todos los datos han sido etiquetados")


@app.get('/api/Review')
def Review():
    return send_file("static/Traslate/Check/Test.html")
@app.get('/api/DataE/<P>')
def texcheck(P):
    dfCol=pd.read_csv('error.csv')
    dacolu=pd.DataFrame(dfCol)
    eng=len(dacolu)
    print("La p vale "+P)
    k=int(P)-1
    TextUserSp=dacolu.loc[k,'TextUser']
    Tipo=dacolu.loc[k,'Tipo']
    idd=dacolu.loc[k,'ID']
    disc=pd.read_csv('DISCPP.csv')
    dfdiscu=pd.DataFrame(disc)
    Disc=dfdiscu.loc[idd,'TextUser']
    cleaver=pd.read_csv('CLEAVER.csv')
    dfcleaver=pd.DataFrame(cleaver)
    Cleaver=dfcleaver.loc[idd,'TextUser']
    return jsonify({'TextUserSp':TextUserSp,'Tipo':Tipo,'g':eng,'DISC':Disc,'Cleaver':Cleaver})
#################################################################################################

@app.get('/api/Etiquetador/<P>')
def EtiquetadorManual(P):
    dfeng=pd.read_csv('Datacollect.csv')
    dafeng=pd.DataFrame(dfeng)
    eng=len(dfeng)
    print("La p vale "+P)
    k=int(P)
    if k != len(dfeng):
        print("La i vale ",k)
        TextUserSp = dafeng.loc[k,'TextUser']
        print("El texto sacado del csv es "+ TextUserSp)
        print(TextUserSp)
        texto= tokenizer.tokenize(TextUserSp)
        stop=stopwords.words('spanish')
        st_txt = [word for word in texto if word not in stop]
        dataframem=pd.read_csv('Dataset.csv')
        dafema=pd.DataFrame(dataframem)
        lista={'Coincidencias':'','id':'','Tipo':'','TextUser':''}
        perfil=[]
        for s in range(0,12):
            n=0
            for h in range(0,len(dafema)):
                txt = dafema.loc[h,'TextUser']
                idd=dafema.loc[h,'ID']
                Tipo=dafema.loc[h,'Tipo']
                palabras=[]
                listapalabras=['personas','puntos','fuertes','persona','Mis','mis','mi','debilidad','fortaleza','debilidades','fortalezas','Debilidad','Fortaleza','Debilidades','Fortalezas','gusta', 'gustan', 'y', 'es', 'que', 'soy', 'un','si','muy','Y','en','con', 'una','de','me','Mi', 'Soy','hay']
                if s == idd:
                    for b in range(0,len(st_txt)):
                        secuencia = r'(?i)\w*'+str(st_txt[b])+'\w*'
                        busqueda = re.findall(secuencia,txt)
                        if len(busqueda)!=0:
                            for j in range(0,len(busqueda)):
                                if(not(busqueda[j] in palabras)) and (not(busqueda[j] in listapalabras)):
                                    palabras.append(busqueda[j])
                                    n=len(palabras)
                    if n>=1:
                        perfil.append({'Coincidencias':n,'id':idd,'Tipo':Tipo,'TextUser':txt,'Palabras':palabras})
                        palabras=[]
                        n=0
        num=[]
        mayor=[]
        fail=False
        def sacapr(b):
            if len(num) >= 0:
                for i in range(0,len(num)-1):
                    if b == num[i]:
                        num.pop(i)
                        return False
                else:
                    return True
        for kf in perfil:
            v=kf["Coincidencias"]
            num.append(int(v))
        while(len(num)!=0)and(not fail):
            Max=(numpy.max(num))
            fail=sacapr(Max)
            mayor.append(Max)
        print("Más cercanos")
        print(mayor[:5])
        Tipos=[]
        Coincidencias=[]
        IDS=[]
        def buscar(m):
            for p in range(0,12):
                for n in perfil:
                    coin=n["Coincidencias"]
                    if coin == mayor[m]:
                        return n
        ran=5
        if(len(mayor)<5):
            ran=len(mayor)
        for find in range(0,ran):
            bb=buscar(find)
            found = str(bb['Palabras'])
            N=str(bb['id'])
            IDS.append(N)
            Pf=str(bb['Tipo'])
            Tipos.append(Pf)
            Coincidencias.append(found)
        
    return jsonify({'g':eng,'TextUserSp':TextUserSp,'Coincidencias':Coincidencias,'IDS':IDS,'Tipos':Tipos})
@app.get('/api/Edit')
def Edit():
    return send_file("static/Traslate/Check/Test.html")



from sklearn.feature_extraction.text import TfidfVectorizer
@app.get('/api/BetaSVM')
def SVMBETA():
    return send_file("static/DISC/Check/Test.html")
@app.get('/SVM/EtiquetadorBeta/<P>')
def EtiquetadorBeta(P):
    stop_words_disctest= stopwords.words('spanish')
    tfidf=TfidfVectorizer(stop_words=stop_words_disctest)
    dfeng=pd.read_csv('Datacollect.csv')
    dafeng=pd.DataFrame(dfeng)
    eng=len(dfeng)
    print("La p vale "+P)
    k=int(P)
    IDS=[]
    data_t=[]
    if k != len(dfeng):
        print("La i vale ",k)
        TextUserSp = dafeng.loc[k,'TextUser']
        print("El texto sacado del csv es "+ TextUserSp)
        print(TextUserSp)
        text=[TextUserSp]
        datosdi=pd.read_csv('DISCPP.csv',header=0)
        dfd=pd.DataFrame(datosdi)
        pipeline_model=joblib.load('SVM1.pkl')
        pipeline_model2=joblib.load('SVM2.pkl')
        prediccion= pipeline_model.predict(text)
        prediccion1=pipeline_model2.predict(text)
        print(prediccion[0])
        print(prediccion1[0])
        data_t.append(dfd.loc[prediccion[0],'Tipo'])
        data_t.append(dfd.loc[prediccion1[0],'Tipo'])
        IDS.append(int(prediccion[0]))
        IDS.append(int(prediccion1[0]))
        predicciones=pipeline_model.decision_function(text)
        print(predicciones[0])
        l=int((predicciones[0][prediccion[0]])*100)
        print(l,"%")
    return jsonify({'g':eng,'TextUserSp':TextUserSp,'IDS':IDS,'Tipos':data_t})







@app.get('/api/BSVMAuto')
def SVMBA():
    return send_file("static/AutoSVM/TestA.html")
@app.get('/SVM/EtiquetadorBetaA/<P>')
def EtiquetadorBA(P):
    dfeng=pd.read_csv('Exceptions.csv')
    dafeng=pd.DataFrame(dfeng)
    eng=len(dfeng)
    print("La p vale "+P)
    k=int(P)
    IDS=[]
    data_t=[]
    seg = random.randint(0,1)
    print("Los datos serán enviados dentro de ",seg,"segundos")
    print("")
    if k != len(dfeng):
        print("La i vale ",k)
        TextUserSp = dafeng.loc[k,'TextUser']
        print("El texto sacado del csv es "+ TextUserSp)
        print(TextUserSp)
        text=[TextUserSp]
        datosdi=pd.read_csv('DISCPP.csv',header=0)
        dfd=pd.DataFrame(datosdi)
        pipeline_model=joblib.load('SVM1.pkl')
        pipeline_model2=joblib.load('SVM2.pkl')
        prediccion= pipeline_model.predict(text)
        prediccion1=pipeline_model2.predict(text)
        print(prediccion[0])
        print(prediccion1[0])
        data_t.append(dfd.loc[prediccion[0],'Tipo'])
        data_t.append(dfd.loc[prediccion1[0],'Tipo'])
        IDS.append(int(prediccion[0]))
        IDS.append(int(prediccion1[0]))
        predicciones=pipeline_model.decision_function(text)
        print(predicciones[0])
        l=int((predicciones[0][prediccion[0]])*100)
        print(l,"%")
        error=0
        TextUser=str(TextUserSp)
        Timer=str('0:0')
        Txtime=str('0:0')
        #if(l>=50):
            #print("El dato se etiquetó correctamente >50 por l")
            #ID = str(prediccion[0])
            #Tipo= str(data_t[0])
            #with open("Dataset.csv","a",newline="",encoding='utf-8') as File:
            #    writer = csv.writer(File)
            #    writer.writerow([ID,Tipo,TextUser,Timer,Txtime])
            #    File.close()
            #return jsonify({'g':eng,'TextUserSp':TextUserSp,'IDS':IDS,'Tipos':data_t,'time':seg})
        ###elif(l>=50):
         ###   print("El dato se etiquetó correctamente >50 por l2")
         ###   ID = str(prediccion1[0])
         ###   Tipo= str(data_t[1])
         ###   with open("Dataset.csv","a",newline="",encoding='utf-8') as File:
       ###         writer = csv.writer(File)
          ###      writer.writerow([ID,Tipo,TextUser,Timer,Txtime])
           ###     File.close()
          ###  return jsonify({'g':eng,'TextUserSp':TextUserSp,'IDS':IDS,'Tipos':data_t})###
        if(int(prediccion[0])==int(prediccion1[0])):
            print("El dato se etiquetó correctamente ==")
            ID = str(prediccion[0])
            Tipo= str(data_t[0])
            with open("Dataset.csv","a",newline="",encoding='utf-8') as File:
                writer = csv.writer(File)
                writer.writerow([ID,Tipo,TextUser,Timer,Txtime])
                File.close()
            return jsonify({'g':eng,'TextUserSp':TextUserSp,'IDS':IDS,'Tipos':data_t,'time':seg,'error':error})
        elif(int(prediccion[0])==2):
            print("El dato se etiquetó correctamente D/C")
            ID = str(prediccion[0])
            Tipo= str(data_t[0])
            with open("Dataset.csv","a",newline="",encoding='utf-8') as File:
                writer = csv.writer(File)
                writer.writerow([ID,Tipo,TextUser,Timer,Txtime])
                File.close()
            return jsonify({'g':eng,'TextUserSp':TextUserSp,'IDS':IDS,'Tipos':data_t,'time':seg,'error':error})
        elif(int(prediccion1[0])==2):
            print("El dato se etiquetó correctamente D/C")
            ID = str(prediccion1[0])
            Tipo= str(data_t[1])
            with open("Dataset.csv","a",newline="",encoding='utf-8') as File:
                writer = csv.writer(File)
                writer.writerow([ID,Tipo,TextUser,Timer,Txtime])
                File.close()
            return jsonify({'g':eng,'TextUserSp':TextUserSp,'IDS':IDS,'Tipos':data_t,'time':seg,'error':error})
        else:
            print("El dato no pudo ser etiquetado :C")
            ID = str(prediccion1[0])
            Tipo= str(data_t[1])
            print("Error guardó la clasificación")
            with open("error.csv","a",newline="",encoding='utf-8') as File:
                writer = csv.writer(File)
                writer.writerow([ID,Tipo,TextUser,Timer,Txtime])
                File.close()
            error=1
    return jsonify({'g':eng,'TextUserSp':TextUserSp,'IDS':IDS,'Tipos':data_t,'time':seg,'error':error})

@app.get('/api/Review2')
def Reviw2():
    return send_file("static/Review2/Reviw2.html")
@app.get('/api/BuscarP/<obj>')
def BuscarP(obj):
    buscar=str(obj)
    print("Se va buscar el perfil "+str(buscar))
    DVr=pd.read_csv('Dataset.csv')
    dfVace=pd.DataFrame(DVr)
    datausers=[]
    for h in range(0,len(dfVace)):
        if(buscar==str(dfVace.loc[h,'ID'])):
            ID=int(dfVace.loc[h,'ID'])
            Tipe = dfVace.loc[h,'Tipo']
            TextUser = dfVace.loc[h,'TextUser']
            datausers.append({'TextUser':TextUser,'ID':h,'Tipo':Tipe,'IdText':h,'ID':ID})
    return jsonify(datausers)
@app.get('/api/delete/Text/<id>')
def delete_T(id):
    print("#################################")
    print("# Se va reemplazar el dato "+id+" #")
    print("#################################")
    datUsr=pd.read_csv('error.csv')
    new_data=datUsr
    print(id)
    answer=int(id)
    for h in range(0,len(datUsr)):
        if(answer==h):
            print(new_data)
            new_data=new_data.drop(h)
            print(new_data)
            new_data.to_csv('error.csv',index=False)
    return redirect(url_for('Puestos'))





##########################################   Exepciónes ###########################
@app.get('/api/Exception')
def Exception():
    return send_file("static/Exeptions/Exception.html")
@app.get('/api/BuscarE/<obj>')
def BuscarE(obj):
    buscar=str(obj)
    print("Se va buscar el perfil "+str(buscar))
    DVr=pd.read_csv('Exceptions.csv')
    dfVace=pd.DataFrame(DVr)
    datausers=[]
    for h in range(0,len(dfVace)):
        TextUser = dfVace.loc[h,'TextUser']
        datausers.append({'TextUser':TextUser,'IdText':h})
    return jsonify(datausers)
@app.get('/Exeptions/delete/Text/<id>')
def delete_E(id):
    print("#################################")
    print("# Se va reemplazar el dato "+id+" #")
    print("#################################")
    datUsr=pd.read_csv('Exceptions.csv')
    new_data=datUsr
    print(id)
    answer=int(id)
    for h in range(0,len(datUsr)):
        if(answer==h):
            print(new_data)
            new_data=new_data.drop(h)
            print(new_data)
            new_data.to_csv('Exceptions.csv',index=False)
    return redirect(url_for('Puestos'))


####Perfiles duplicados#####
@app.get('/api/BuscarDup/<obj>')
def BuscarDup(obj):
    buscar=int(obj)
    print("Se va buscar el perfil "+str(buscar))
    DVr=pd.read_csv('Dataset.csv')
    dfVace=pd.DataFrame(DVr)
    copias=[]
    for h in range(0,len(dfVace)):
        if(h!=buscar):
            Text2 = dfVace.loc[h,'TextUser']
            perfil2=dfVace.loc[h,'Tipo']
            perfil1=dfVace.loc[buscar,'Tipo']
            Text1= dfVace.loc[buscar,'TextUser']
            if(Text1==Text2):
                print("Hay dos perfiles con el mismo texto")
                copias.append({'Text1':Text1,'IdText1':h,'IdText2':buscar,'perfil2':perfil2,'perfil1':perfil1})
    return jsonify(copias)

if __name__=='__main__':
    app.config.from_object(config['development'])
    app.run()
    app.register_error_handler(401,status_401)
    
