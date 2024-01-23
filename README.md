# Introduction
## The project is a seismology real-time monitoring system at Lantai landslide area in Taiwan, Ilan. The system uses a seismic network (10 stations) to monitor environmental noise, microseismic activity and slope movement in landslide areas. Front-end and back-end separation is used to demonstrate the system. The back-end includes receiving real-time seismic wave signals, data pre-processing, scientific calculations and data transmission, mainly using python flask. The front end is responsible for receiving back-end data and web page display, mainly using React.js. Due to security protocols, the website is not public and is owned by the Earth Structure Laboratory of the Institute of Earth Sciences, Academia Sinica. (hhhuang@earth.sinica.edu.tw)

# Backend
## Receiving real-time data
### In `./api` folder, it contains two scripts, run.py and seedlink_plotter.py.
### The `seedlink` module is used to fetch real-time seismic data, the output will be the data stream defined in `obspy` library.
### The script `run.py` get the seismic data from seedlink, and do the pre-processing with obspy. Including demean, resample and zero-fill. Aftering generating processed data, the output will be transferd into json format. By using `socketio`, the 2 minutes real-time data are send to the frontend.
```
python api/run.py --port 5000
```
## Calculating seismic velocity change (dv/v)
### In `./Cron_code` folder,
