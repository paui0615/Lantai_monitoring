# 1. Lantai monitoring system
### The project is a seismology real-time monitoring system at Lantai landslide area in Taiwan, Ilan. The system uses a seismic network (11 stations) to monitor environmental noise, microseismic activity and slope movement in landslide areas. Front-end and back-end separation is used to demonstrate the system. The back-end includes receiving real-time seismic wave signals, data pre-processing, scientific calculations and data transmission, mainly using python flask. The front end is responsible for receiving back-end data and web page display, mainly using React.js. Due to security protocols, the website is not public and is owned by the Earth Structure Laboratory of the Institute of Earth Sciences, Academia Sinica. (hhhuang@earth.sinica.edu.tw)

# 2. Backend
## Receiving real-time data
### In `./api` folder, it contains two scripts, run.py and seedlink_plotter.py.
### The `seedlink` module is used to fetch real-time seismic data, the output will be the data stream defined in `obspy` library.
### The script `run.py` get the seismic data from importing `seedlink`, and do the pre-processing with obspy. Including demean, resample and zero-fill. Aftering generating processed data, the output will be transferd into json format. By using `socketio`, the 2 minutes real-time data are send to the frontend every 10 seconds.
```
$ python api/run.py
```
## Calculating seismic velocity change (dv/v) (See citations for details)
### In `./Cron_code` folder, The script `get_dvv.py` read the updating data from our server for 11 stations and write as a local json file in `./public`. Linux Crontab is used to daily execute the updating output.
```
In crontab mode:
$ crontab -e
$ 0 0 * * * /usr/local/bin/python3.9 ./Cron_code/get_dvv.py
```

# 3. Frontend
### The web development is built up by React.js. I use `react-bootstrap` to construct the grid system of the web. There are also some techniques help me to complete it (./src/components):
* Realtime.js: The `socket` module can realize real-time data transmission. The `recharts` library perfroms seismogram figures.
* Map.js: `mapboxgl` is a map tool to show the Lantai landslide region.
* DVV.js: `recharts` plots the line figure of seismic velocity changes estimation (dv/v) for different frequency ranges.
```
In ./ folder:
$ npm start
```

# 4. Web display
https://github.com/paui0615/Lantai_monitoring/assets/125962545/f166b0fd-7cd4-406b-afe5-dc1548c193b5

# Citations
- [Controls on Seasonal Variations of Crustal Seismic Velocity in Taiwan Using Single-Station Cross-Component Analysis of Ambient Noise Interferometry. (Feng et al., 2021)](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2021JB022650)

