from flask import Flask,request ,send_file, jsonify
import pandas as pd
import csv
app= Flask(__name__)

@app.get('/')
def home():
    return send_file("static/index.html")

@app.get('/Test/')
def test():
    return send_file("static/Test/Test.html")

@app.get('/Data/')
def Cont():
    dataframe=pd.read_csv('Dataset.csv')
    dafe=pd.DataFrame(dataframe)
    print(len(dafe))
    datanum=[]
    for s in range(0,14):
        n=0
        Tipo=""
        for h in range(0,len(dafe)):
            num = dafe.loc[h,'ID']
            if s == num:
                Tipo = dafe.loc[h,'Tipo']
                n=n+1
        datanum.append({'Tipo':Tipo,'Total':n})
    print(datanum)
    return jsonify(datanum)


@app.get('/datatxt/<P>')
def textuser(P):
     st=pd.read_csv('BestAnsw.csv',header=0)
     dfe=pd.DataFrame(st)
     num = int(P)
     
     data=dfe.loc[num,'TextUser']
     print("El texto sacado del csv es "+ data)
     return jsonify({'TextUser':data})

@app.get('/csv/')
def csvfile():
    return send_file("Dataset.csv")

@app.post('/api/dataset')
def get_data():
    datos=pd.read_csv('Dataset.csv',header=0)
    df=pd.DataFrame(datos)
    new_data=request.get_json()
    ID = new_data['Id']
    Tipo= new_data['Tipo']
    TextUser=new_data['TextUser']
    Timer=new_data['Timer']
    Txtime=new_data['Txtimer']
    print("Lo que llego del html "+ID,Tipo,TextUser,Timer,Txtime)
    print("DataFrame Original")
    print(df)
    with open("Dataset.csv","a",newline="") as File:
        writer = csv.writer(File)
        writer.writerow([ID,Tipo,TextUser,Timer,Txtime])
        File.close()
    return 'DataFrame Editado'

@app.get('/api/predict')
def predict():
    return 'Prediccion realizada'
if __name__=='__main__':
    app.run(debug=True)
    
