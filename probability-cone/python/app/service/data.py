import yfinance as yf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import logging
from sqlalchemy import create_engine

engine = create_engine('postgresql://curator:PVYG2U2pZeBA3Aqp@localhost:5435/curatordb', pool_size=10,max_overflow=20)

def get_data(names, interval):
    assets = [pd.read_sql_query("select * from " + name + "_" + interval, con=engine, index_col="index") for name in names]
    return {name: asset for name, asset in zip(names, assets)}, assets

def make_n_shifts(data, col_name, n, interval, names):
    assets = [pd.read_sql_query("select * from " + name + "_" + interval, con=engine, index_col="index") for name in names]
    for i in range(1, n+1):
        data[str(col_name + " +" + str(i))] = data[col_name].shift(-i)
    return [make_n_shifts(data, "Open", 20) for name, data in assets.items()];


