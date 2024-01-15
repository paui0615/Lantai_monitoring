from flask import Flask, request, jsonify, session
from flask import *  
from flask_cors import CORS, cross_origin
import obspy
import numpy as np
import datetime
from obspy.core import UTCDateTime
import os
from datetime import timedelta

data_folder="/raid1/Lantai_data/SAC_1day/"
app = Flask(__name__)
cors = CORS(app, resources={r'*':{'origins':'*'}})
app.secret_key = 'your_secret_key'
station_list=['LT01','LT03','LT04','LT05','LT06','LT07','LT08','LT09','LT10']

@app.route('/searchdata', methods=['POST', 'GET'])
#@cross_origin(origins=['*'])
def searchdata():
    
    error=None
    stationname= str(request.json['stationinput'])
    if stationname not in station_list:
        errormessage=stationname+" not in station list"
        return jsonify({'error': errormessage}), 403
    starttime = str(request.json['timeinput1'])
    print(starttime)
    endtime = str(request.json['timeinput2'])
    print(endtime)
    date=starttime[0:8]

    try:
        datetimestart=datetime.datetime.strptime(starttime,'%Y%m%d%H%M')

        datetimeend=datetime.datetime.strptime(endtime,'%Y%m%d%H%M')
        #session['search_start'] = datetimestart
        #session['search_start'] = datetimeend

        print(datetimeend)
        #stampstart=datetime.datetime.timestamp(datetimestart)
        #stampend=datetime.datetime.timestamp(datetimeend)
        utcstart=UTCDateTime(datetimestart)
        utcend=UTCDateTime(datetimeend)
        
    except ValueError as error:
        errormessage='time data '+starttime+' or '+endtime+' does not match format %Y%m%d%H%M'
        return jsonify({'error': errormessage}), 400
        #return jsonify({'error': str(error)}), 400
        print(error)
    time_now=datetime.datetime.now()
    installtime=datetime.datetime.strptime("201601010000",'%Y%m%d%H%M')

    if utcstart < installtime or utcend > time_now:
        errormessage="Time is out of the available range"
        return jsonify({'error': errormessage}), 401
    
    try:
        st=obspy.read(data_folder+date+"/"+stationname+".HHE.SAC")
        st+=obspy.read(data_folder+date+"/"+stationname+".HHN.SAC")
        st+=obspy.read(data_folder+date+"/"+stationname+".HHZ.SAC")
        print(st)
    except FileNotFoundError as error:
        errormessage = "No available data of "+stationname
        return jsonify({'error': errormessage}), 402

    st.trim(utcstart,utcend)
    print(st)


    times=st[0].times("utcdatetime")
    data1=np.float64(st[0].data)
    data2=np.float64(st[1].data)
    data3=np.float64(st[2].data)
    print(data1)
    out_dic=[]

    for i in range(len(times)):
	    out_dic.append({'times':str(times[i]),'value1':data1[i], 'value2':data2[i], 'value3':data3[i]})
    print(out_dic[0])
    return jsonify(out_dic)
    #except:
    #     print('error')
    #     pass





@app.route('/bandpass', methods=['POST', 'GET'])


def bandpass():
    error=None

    stationname= str(request.json['stationinput'])
    starttime = str(request.json['timeinput1'])
    endtime = str(request.json['timeinput2'])
    date=starttime[0:8]
    datetimestart=datetime.datetime.strptime(starttime,'%Y%m%d%H%M')
    datetimeend=datetime.datetime.strptime(endtime,'%Y%m%d%H%M')
    utcstart=UTCDateTime(datetimestart)
    utcend=UTCDateTime(datetimeend)





    st=obspy.read(data_folder+date+"/"+stationname+".HHE.SAC")
    st+=obspy.read(data_folder+date+"/"+stationname+".HHN.SAC")
    st+=obspy.read(data_folder+date+"/"+stationname+".HHZ.SAC")
    print(st)
    samp=st[0].stats.sampling_rate
    st.trim(utcstart,utcend)
    print(st)

    freqmin = float(request.json['freqinput1'])
    freqmax = float(request.json['freqinput2'])

    if freqmax > samp/2:
        error = "fmax cannnot exceed fnq "+samp+"Hz"  
        return jsonify({'error': error}), 402

    elif freqmax <= freqmin:
        error = "fmax cannnot < fmin"
        return jsonify({'error': error}), 402
    else:
       # flash("Bandpass "+str(freqmin)+" - "+str(freqmax)+" Hz")
        st[:].filter("bandpass", freqmin=freqmin, freqmax=freqmax)
    #st[1].filter("bandpass", freqmin=freqmin, freqmax=freqmax)


        times=st[0].times("utcdatetime")
        data1=np.float64(st[0].data)
        data2=np.float64(st[1].data)
        data3=np.float64(st[2].data)
        out_dic=[]

        for i in range(len(times)):
	        out_dic.append({'times':str(times[i]),'value1':data1[i], 'value2':data2[i], 'value3':data3[i]})

        return jsonify(out_dic)

if __name__ == '__main__':
	app.run(port=5001, debug=True)