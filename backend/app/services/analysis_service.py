import pandas as pd
import numpy as np
from typing import Any, Dict


def run_analysis(excel_path: str) -> Dict[str, Any]:
    try:
        if excel_path.lower().endswith('.csv'):
            df = pd.read_csv(excel_path)
        else:
            df = pd.read_excel(excel_path)
    except Exception as e:
        raise RuntimeError(f"Failed to read file: {e}")

    summary = {
        "rowCount": int(len(df)),
        "columnCount": int(len(df.columns)),
        "hasNulls": bool(df.isna().any().any()),
        "dataTypes": {c: str(df[c].dtype) for c in df.columns},
    }

    stats_cols = {}
    for c in df.columns:
        col = df[c]
        if np.issubdtype(col.dtype, np.number):
            stats_cols[c] = {
                "mean": float(col.mean()),
                "median": float(col.median()),
                "min": float(col.min()),
                "max": float(col.max()),
            }
        else:
            vc = col.astype(str).value_counts().head(5)
            stats_cols[c] = {
                "unique": int(col.nunique()),
                "frequent": {k: int(v) for k, v in vc.items()},
            }

    visualizations = []
    num_cols = [c for c in df.columns if np.issubdtype(df[c].dtype, np.number)]
    if num_cols:
        first = num_cols[0]
        series = df[first].dropna()
        bins = np.linspace(series.min(), series.max(), 8)
        counts, edges = np.histogram(series, bins=bins)
        visualizations.append({
            "id": f"dist-{first}",
            "title": f"Distribution of {first}",
            "type": "bar",
            "data": [
                {"range": f"{round(edges[i],2)}-{round(edges[i+1],2)}", "count": int(counts[i])}
                for i in range(len(counts))
            ]
        })

    return {
        "summary": summary,
        "statistics": {"columns": stats_cols},
        "visualizations": visualizations,
    }


def extract_eeg_line_series(excel_path: str, prefix: str = "eeg_", max_points: int = 1000):
    """Return down-sampled line series for EEG columns starting with prefix.

    Structure:
    {
      "series": [
        {"column": "eeg_fp1_ref", "points": [{"x": 0, "value": 0.123}, ...] },
        ...
      ]
    }
    """
    try:
        if excel_path.lower().endswith('.csv'):
            df = pd.read_csv(excel_path)
        else:
            df = pd.read_excel(excel_path)
    except Exception as e:
        raise RuntimeError(f"Failed to read file: {e}")

    cols = [c for c in df.columns if c.lower().startswith(prefix) and np.issubdtype(df[c].dtype, np.number)]
    series_out = []
    if not cols:
        return {"series": series_out}
    step = max(1, len(df) // max_points) if len(df) > max_points else 1
    idx_series = range(0, len(df), step)
    for col in cols:
        col_data = df[col].iloc[::step].reset_index(drop=True)
        points = [{"x": int(i*step), "value": (None if (pd.isna(v)) else float(v))} for i, v in enumerate(col_data)]
        series_out.append({"column": col, "points": points})
    return {"series": series_out}
