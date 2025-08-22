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
