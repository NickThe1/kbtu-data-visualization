from flask import Flask, render_template, jsonify
import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from statsmodels.regression.linear_model import OLSResults

from sklearn.preprocessing import MinMaxScaler, StandardScaler, RobustScaler
import statsmodels.api as sm

app = Flask(__name__)

names = ["GOOGL", "AAPL", "AMZN", "TSLA", "XOM", "V", "JPM",
          "NVDA", "TSM", "MA", "HD", "BAC", "KO"]

names = [i.lower() for i in names]

interval = "1h"

engine = create_engine('postgresql://curator:PVYG2U2pZeBA3Aqp@localhost:5435/curatordb', pool_size=10, max_overflow=20)


def get_data(names, interval):
    assets = [pd.read_sql_query("select * from " + name + "_" + interval, con=engine, index_col="index") for name in names]
    return {name: asset for name, asset in zip(names, assets)}

def make_n_shifts(data, col_name, n):
    for i in  range(1, n+1):
        data[str(col_name + " +" + str(i))] = data[col_name].shift(-i)


def generate_cone(model, data, n):
    lower_reg_w = np.array(model.params) - 1.96 * np.array(model.bse)
    upper_reg_w = np.array(model.params) + 1.96 * np.array(model.bse)

    lower_data = data
    upper_data = data

    for i in range(n):
        lower_data = np.append(lower_data, (lower_reg_w * lower_data[i:]).sum())
        upper_data = np.append(upper_data, (upper_reg_w * upper_data[i:]).sum())

    return lower_data, upper_data

@app.route('/')
def main():  # put application's code here
    return render_template("index.html")

@app.route('/data/<asset_name>//<int:it>')
def data(asset_name, it):
    try:
        lin_reg = OLSResults.load(
            r"C:\Users\1\Desktop\учеба\visualisation\kbtu-data-visualization\probability-cone\python\reserch\lin_reg.pickle")
        assets = get_data(names, interval)
        [make_n_shifts(data, "Open", 20) for name, data in assets.items()]
        scaler = RobustScaler()

        X = scaler.fit_transform(assets[asset_name].iloc[:-20, 7:26].to_numpy())
        X = sm.add_constant(X)
        lower_data, upper_data = generate_cone(lin_reg, X[it], 10)
        # lower_data, upper_data = scaler.inverse_transform([lower_data]).T, scaler.inverse_transform([upper_data]).T
        low = pd.DataFrame(lower_data, columns=["low"])
        low["up"] = pd.DataFrame(upper_data)
        low["ind"] = low.index
        return low.to_json(orient='records')
    except:
        return None

if __name__ == '__main__':
    app.run(debug=True)
