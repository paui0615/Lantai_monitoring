#!/usr/bin/env python
from __future__ import print_function
from matplotlib.dates import date2num

from obspy import Stream, Trace
# from obspy import __version__ as OBSPY_VERSION
from obspy.core import UTCDateTime
from argparse import ArgumentParser,ArgumentDefaultsHelpFormatter
import threading
import time
import warnings
import os
import sys
from urllib.request import URLError
import logging


# OBSPY_VERSION = [int(x) for x in OBSPY_VERSION.split(".")[:2]]

from obspy.clients.seedlink.slpacket import SLPacket
from obspy.clients.seedlink import SLClient
from obspy.clients.fdsn import Client

class SeedlinkTrimmer():
    def __init__(self, stream=None, myargs=None, lock=None, trace_ids=None, *args, **kwargs):
        args = myargs
        self.lock = lock
        self.backtrace = args.backtrace_time
        self.args = args
        self.stream = stream
        self.ids = trace_ids
        self.trimmer()

    def trimmer(self):
        now = UTCDateTime()
        self.start_time = now - self.backtrace
        self.stop_time = now

        with self.lock:
            # leave some data left of our start for possible processing
            self.stream.trim(
                starttime=self.start_time - 120, nearest_sample=False)
            stream = self.stream.copy()            
        try:
            logging.info(str(stream.split()))
            if not stream:
                raise Exception("Empty stream for plotting")

            stream.merge(-1)
            stream.trim(starttime=self.start_time, endtime=self.stop_time)

            for tr in stream:
                tr.stats.processing = []
            # self.plot_lines(stream)
            # print(self.stream)
            return stream
        except Exception as e:
            print("Exception error")
            logging.error(e)
            pass

    # def plot_lines(self, stream):
    #     for id_ in self.ids:
    #         if not any([tr.id == id_ for tr in stream]):
    #             net, sta, loc, cha = id_.split(".")
    #             header = {'network': net, 'station': sta, 'location': loc,
    #                       'channel': cha, 'starttime': self.start_time}
    #             data = np.zeros(2)
    #             stream.append(Trace(data=data, header=header))
    #     # stream.sort()
    #     for tr in stream:
    #         tr.stats.processing = [] 
    #     print(stream[0].stats)
        # return stream

class SeedlinkUpdater(SLClient):

    def __init__(self, stream, myargs=None, lock=None):
        # loglevel NOTSET delegates messages to parent logger
        super(SeedlinkUpdater, self).__init__(loglevel="NOTSET")
        self.stream = stream
        self.lock = lock
        self.args = myargs

   
    def packet_handler(self, count, slpack):
        """
        for compatibility with obspy 0.10.3 renaming
        """
        self.packetHandler(count, slpack)

    def packetHandler(self, count, slpack):
        """
        Processes each packet received from the SeedLinkConnection.
        :type count: int
        :param count:  Packet counter.
        :type slpack: :class:`~obspy.seedlink.SLPacket`
        :param slpack: packet to process.
        :return: Boolean true if connection to SeedLink server should be
            closed and session terminated, false otherwise.
        """

        # check if not a complete packet
        if slpack is None or (slpack == SLPacket.SLNOPACKET) or \
                (slpack == SLPacket.SLERROR):
            return False

        # get basic packet info
        type = slpack.get_type()

        # process INFO packets here
        if type == SLPacket.TYPE_SLINF:
            return False
        if type == SLPacket.TYPE_SLINFT:
            logging.info("Complete INFO:" + self.slconn.getInfoString())
            if self.infolevel is not None:
                return True
            else:
                return False

        # process packet data
        trace = slpack.get_trace()
        if trace is None:
            logging.info(
                self.__class__.__name__ + ": blockette contains no trace")
            return False

        # new samples add to the main stream which is then trimmed
        with self.lock:
            self.stream += trace
            self.stream.merge(-1)
            for tr in self.stream:
                tr.stats.processing = []
        return False

    def getTraceIDs(self):
        """
        Return a list of SEED style Trace IDs that the SLClient is trying to
        fetch data for.
        """
        ids = []
        streams = self.slconn.get_streams()
        # if OBSPY_VERSION < [1, 0]:
        #     streams = self.slconn.getStreams()
        # else:
        #     streams = self.slconn.get_streams()
        for stream in streams:
            net = stream.net
            sta = stream.station
            selectors = stream.get_selectors()
            # if OBSPY_VERSION < [1, 0]:
            #     selectors = stream.getSelectors()
            # else:
            #     selectors = stream.get_selectors()
            for selector in selectors:
                if len(selector) == 3:
                    loc = ""
                else:
                    loc = selector[:2]
                cha = selector[-3:]
                ids.append(".".join((net, sta, loc, cha)))
        ids.sort()
        return ids

def _parse_time_with_suffix_to_seconds(timestring):
    """
    Parse a string to seconds as float.

    If string can be directly converted to a float it is interpreted as
    seconds. Otherwise the following suffixes can be appended, case
    insensitive: "s" for seconds, "m" for minutes, "h" for hours, "d" for days.

    >>> _parse_time_with_suffix_to_seconds("12.6")
    12.6
    >>> _parse_time_with_suffix_to_seconds("12.6s")
    12.6
    >>> _parse_time_with_suffix_to_minutes("12.6m")
    756.0
    >>> _parse_time_with_suffix_to_seconds("12.6h")
    45360.0

    :type timestring: str
    :param timestring: "s" for seconds, "m" for minutes, "h" for hours, "d" for
        days.
    :rtype: float
    """
    try:
        return float(timestring)
    except:
        timestring, suffix = timestring[:-1], timestring[-1].lower()
        mult = {'s': 1.0, 'm': 60.0, 'h': 3600.0, 'd': 3600.0 * 24}[suffix]
        return float(timestring) * mult


def _parse_time_with_suffix_to_minutes(timestring):
    """
    Parse a string to minutes as float.

    If string can be directly converted to a float it is interpreted as
    minutes. Otherwise the following suffixes can be appended, case
    insensitive: "s" for seconds, "m" for minutes, "h" for hours, "d" for days.

    >>> _parse_time_with_suffix_to_minutes("12.6")
    12.6
    >>> _parse_time_with_suffix_to_minutes("12.6s")
    0.21
    >>> _parse_time_with_suffix_to_minutes("12.6m")
    12.6
    >>> _parse_time_with_suffix_to_minutes("12.6h")
    756.0

    :type timestring: str
    :param timestring: "s" for seconds, "m" for minutes, "h" for hours, "d" for
        days.
    :rtype: float
    """
    try:
        return float(timestring)
    except:
        seconds = _parse_time_with_suffix_to_seconds(timestring)
    return seconds / 60.0

def updator(streams):
    # print(streams.trimmer()[0])

    while 1:
        stream = streams.trimmer()
        time.sleep(2)
        yield stream


#------------------------------------------------------------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import numpy as np
from flask_socketio import SocketIO, emit
import random
import json

from datetime import datetime, timedelta


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'
app.config['DEBUG'] = True
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r'*':{'origins':'*'}})
socketio = SocketIO(app, cors_allowed_origins="*")
@app.route('/')
@cross_origin(origins=['*'])
def index():
    return "test"

@socketio.on('random_data',namespace='/')
def send_rawdata():

    global streams
    parser = ArgumentParser(prog='seedlink_plotter',
                            description='Plot a realtime seismogram of a station',
                            formatter_class=ArgumentDefaultsHelpFormatter)

    args = parser.parse_args()

    args.seedlink_streams = "streams name"
    args.backtrace_time = _parse_time_with_suffix_to_seconds("2m")
    args.seedlink_server = "ip"
    args.update_time = _parse_time_with_suffix_to_seconds("10s")


    loglevel = logging.CRITICAL
    logging.basicConfig(level=loglevel)

    now = UTCDateTime()
    stream = Stream()
    lock = threading.Lock()

    # cl is the seedlink client
    seedlink_client = SeedlinkUpdater(stream, myargs=args, lock=lock)
    seedlink_client.slconn.set_sl_address(args.seedlink_server)
    seedlink_client.multiselect = args.seedlink_streams
    seedlink_client.begin_time = (now - args.backtrace_time).format_seedlink()

    seedlink_client.initialize()
    ids = seedlink_client.getTraceIDs()
    # start cl in a thread
    thread = threading.Thread(target=seedlink_client.run)
    thread.setDaemon(True)
    thread.start()
    # Wait few seconds to get data for the first plot
    #time.sleep(5)
    samp_rate=20.0
    timespan=2*60.0
    totalnum=samp_rate*timespan
    delta = timedelta(seconds=0.05)
    try:
        streams = SeedlinkTrimmer(stream=stream, myargs=args,lock=lock, trace_ids=ids)
        print("Stream:")
        print(streams)
    except:
        pass
    
    while True:
        try:
            st = streams.trimmer()
            if not bool(st):
                pass
            st.resample(samp_rate)
            st.detrend("demean")

            times=st[0].times("utcdatetime")
            start_date=times[0]
            end_date=start_date+timespan
            utc_datetimes = []
            out_dic=[]
            sta_list=[]
            while start_date < end_date:
                utc_datetimes.append(start_date)
                start_date += delta

    
            for j in range(len(st)):   
                stdata=[]
                stdata=list(st[j].data)
                if len(stdata) < totalnum:
                    diff = totalnum - len(stdata)
                    stdata+=int(diff)*[0]            
                sta_list.append(st[j].stats.station)
                globals()['data'+str(j)] = np.float64(stdata)


            for i in range(len(utc_datetimes)):
                out_dic.append({'times':str(utc_datetimes[i])})

                for j in range(len(sta_list)):
                    sta=str(sta_list[j])
                    if globals()['data'+str(j)][i] is not None:
                        out_dic[i][sta]=globals()['data'+str(j)][i]
                    else:
                        out_dic[i][sta]=str(null)

            socketio.emit('json', out_dic, broadcast=True)
            time.sleep(10)
        except: 
            pass

if __name__ == '__main__':
    socketio.run(app, port=5000)
        


