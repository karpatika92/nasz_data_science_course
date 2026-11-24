# Plan (prompt 1; no code written in this step)

Source: lessons/05-regresszio/homework.md. One notebook, `notebook.ipynb`. CLAUDE.md rules apply.

## What I need you to decide (with the default I will use, so I do not block)
1. Question/loss: is under- or over-estimation costlier? Assumed: for a pricing/appraisal use, big absolute dollar errors on expensive houses and systematic over-bidding are the costly ones; no asymmetric loss. Primary metric: RMSE in USD (fits the bootstrap CI later), secondary WAPE (proportional), RMSLE, MAE, R2.
2. Locked test set: Assumed: the last 15% of rows by last-sale date, whole properties only.
3. "Time-ordered" with 13 months of data: Assumed: expanding-window folds, 4 time chunks of dev data, 3 folds (train chunks 0..k, validate chunk k+1). Chunk 0 is never validated; seasonality is not covered.
4. "Repeated property" key: Assumed: (lat, long, sqft_living, sqft_lot, yr_built, zipcode), as in the homework table. A property goes to one chunk by its last sale date (a first-sale-date draft let resales leak later rows into earlier chunks).
5. Cleaning: Assumed: drop the 33-bedroom row only (likely typo); keep other outliers; yr_renovated==0 -> renovated flag, not a year; zipcode is categorical.
6. Order conflict: homework lists EDA before the split, CLAUDE.md says split first then look. Assumed: CLAUDE.md wins: lock test + draw folds first, EDA on dev only.
7. Seeds/compute: 3 folds, XGB<=300 trees, RF<=100 trees, seed 0.

## Steps, outputs, checks
1. Load + dtypes. Output: shape. Check: 21613 x 20, 0 NaN, date range 2014-05-02..2015-05-27 (printed, compared to homework table).
2. Split first: property key, locked test, 3 time folds. Output: shapes and date ranges per fold. Check: zero property ids shared between train/val or dev/test (asserted), val dates later than train dates.
3. EDA on dev (2 plots: price distribution raw+log; price vs sqft_living or map) and cleaning with one-line reasons. Check: row counts before/after per rule printed.
4. Baselines (mean, zip median from train, log-target ridge with zip dummies) on the same folds. Check: mean baseline R2 ~ 0 or below; ridge beats zip median.
5. Tree, RF, XGBoost, same folds, no tuning. Output: ONE table of RMSE, MAE, WAPE, RMSLE, R2 as mean +- std over folds, plus the back-transform bias (sum pred / sum actual) for the log model. Check: all models share identical fold indices (asserted).
6. Diagnostics on best model OOF predictions: calibration by decile, residual vs predicted, residual by segment, residual map. Check: OOF has exactly the validation rows once each; 2 sentences per plot; 3 ranked hypotheses stored in a markdown cell.
7. Hypothesis #1 only, leakage-safe (target-derived features fit inside the training fold, excluding the row itself and its same-property siblings). Output: paired per-fold RMSE difference, mean +- std. Check: verdict says "no help" if |mean diff| <= std.
8. Test set once: refit on all dev, score chosen model + baselines, bootstrap 95% CI for RMSE resampling whole properties. Check: chosen model chosen from CV only (printed before the test is touched).
9. Leakage self-review with cell references, then 10-line summary printed from variables.
10. Limits (3 sentences) and a "did not do" list.
