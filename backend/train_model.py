import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score


# ==============================
# 1. LOAD DATASET
# ==============================

DATA_PATH = "backend/data/UNSW_NB15_training-set.csv"

print("Loading dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset shape: {df.shape}")


# ==============================
# 2. REMOVE UNNECESSARY COLUMNS
# ==============================

# label = target we want to predict
X = df.drop(columns=["label", "attack_cat"])

y = df["label"]


# ==============================
# 3. IDENTIFY COLUMNS
# ==============================

categorical_columns = X.select_dtypes(
    include=["object"]
).columns.tolist()

numerical_columns = X.select_dtypes(
    exclude=["object"]
).columns.tolist()

print("\nCategorical columns:")
print(categorical_columns)

print("\nNumerical columns:")
print(numerical_columns)


# ==============================
# 4. PREPROCESSING
# ==============================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_columns
        ),
        (
            "numerical",
            "passthrough",
            numerical_columns
        )
    ]
)


# ==============================
# 5. AI MODEL
# ==============================

model = RandomForestClassifier(
    n_estimators=150,
    max_depth=20,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced"
)


# ==============================
# 6. CREATE PIPELINE
# ==============================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ==============================
# 7. TRAIN / VALIDATION SPLIT
# ==============================

X_train, X_val, y_train, y_val = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Validation samples:", len(X_val))


# ==============================
# 8. TRAIN MODEL
# ==============================

print("\nTraining SENTINEL AI model...")
print("This may take some time.")

pipeline.fit(X_train, y_train)

print("\nTraining completed!")


# ==============================
# 9. VALIDATION
# ==============================

predictions = pipeline.predict(X_val)

accuracy = accuracy_score(
    y_val,
    predictions
)

print("\n==============================")
print("MODEL RESULTS")
print("==============================")

print("Accuracy:", accuracy)

print("\nClassification Report:")
print(
    classification_report(
        y_val,
        predictions
    )
)


# ==============================
# 10. SAVE MODEL
# ==============================

MODEL_PATH = "sentinel_model.joblib"

joblib.dump(
    pipeline,
    MODEL_PATH
)

print("\nModel saved successfully!")
print("Saved as:", MODEL_PATH)