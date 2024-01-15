import numpy as np
import datetime
import os
from collections import defaultdict
import json


def Global_para():

    global Today
    global sta_list
    global f_list
    global OneMonthAgo

    f_list=['1-4','2-6','4-8','8-12','12-16','16-20']
    sta_list=['LT01','LT02','LT03','LT04','LT05','LT06','LT07','LT08','LT11','LT12','LATB']



def Read_file():
    global dic

    now_date = datetime.datetime.now()
    one_month_ago = now_date - datetime.timedelta(days=90)
    step = datetime.timedelta(days=1)

    DatePeriod = []
    while one_month_ago <= now_date:
        DatePeriod.append(one_month_ago.strftime('%Y%m%d'))
        one_month_ago += step
    print(DatePeriod)

    dic={}
    for sta in sta_list:
        dic[sta] = {}
        for f in f_list:
            dic[sta][f] =[]


    one_month_ago = now_date - datetime.timedelta(days=90)
    dvv_folder = '/raid1/Lantai_data/dv/'
    filelist=os.listdir(dvv_folder)
    for f in filelist:
        print(f)
        f1 = f.split('_')[1].split('-')[0][1:]
        f2 = f.split('_')[1].split('-')[1]

        dvvfile = open(dvv_folder + f).readlines()[1:]
        staref = dvvfile[0].split()[5]
        d=0
        for i in range(len(dvvfile)-1):
            dv = float(dvvfile[i].split()[0])
            corr = float(dvvfile[i].split()[2])
            date = dvvfile[i].split()[4]
            sta1 = dvvfile[i].split()[5]
            sta2 = dvvfile[i].split()[6]
            if sta1 != staref:
                staref = sta1
                d=0

            if sta1 == sta2 and sta1 in sta_list:
                parsed_datetime = datetime.datetime.strptime(date, "%Y%m%d")
                if parsed_datetime >= one_month_ago:               
                    while d < len(DatePeriod) and date != DatePeriod[d]:
                        date_ISO = datetime.datetime.strptime(DatePeriod[d], "%Y%m%d").isoformat()
                        dic[sta1][f1+'-'+f2].append({'Date':date_ISO, 'DVV':None, 'Corr':None})
                        d=d+1  
                    if d < len(DatePeriod):
                        date_ISO = datetime.datetime.strptime(date, "%Y%m%d").isoformat()
                        dic[sta1][f1+'-'+f2].append({'Date':date_ISO, 'DVV':dv, 'Corr':corr})
                        d=d+1
               
    print(dic)

def Write_Json():

    output_folder = '/var/www/html/realtimeapp/public/'

    for sta in sta_list:
        output = open(output_folder + sta + '_dvv.json','w')
        json.dump(dic[sta], output)
        output.close()

if __name__ == "__main__":
    Global_para()
    Read_file()
    Write_Json()