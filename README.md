# Mean-Variance-Standard Deviation Calculator

A Python project developed as part of the **freeCodeCamp Data Analysis with Python Certification**. This project uses NumPy to perform statistical calculations on a 3 × 3 matrix, including mean, variance, standard deviation, maximum, minimum, and sum.

## Project Overview

The calculator accepts a list of nine numerical values, converts them into a 3 × 3 NumPy array, and calculates statistical measures across rows, columns, and the entire matrix.

## Technologies Used

- **Python** – Programming language
- **NumPy** – Numerical computing and statistical calculations

## Features

The calculator performs six statistical operations:

- **Mean** – Calculates the average.
- **Variance** – Measures the spread of values.
- **Standard Deviation** – Measures the dispersion of values.
- **Maximum** – Identifies the largest value.
- **Minimum** – Identifies the smallest value.
- **Sum** – Calculates the total of the values.

Each operation is performed in three ways:

1. Row-wise calculations (`axis=1`).
2. Column-wise calculations (`axis=0`).
3. Calculations across all nine elements (flattened matrix).

## Example

**Input:**

```python
calculate([0, 1, 2, 3, 4, 5, 6, 7, 8])
```

**Output:**

```python
{
    'mean': [[3.0, 4.0, 5.0], [1.0, 4.0, 7.0], 4.0],
    'variance': [[6.0, 6.0, 6.0],
                 [0.6666666666666666, 0.6666666666666666, 0.6666666666666666],
                 6.666666666666667],
    'standard deviation': [[2.449489742783178, 2.449489742783178, 2.449489742783178],
                           [0.816496580927726, 0.816496580927726, 0.816496580927726],
                           2.581988897471611],
    'max': [[6, 7, 8], [2, 5, 8], 8],
    'min': [[0, 1, 2], [0, 3, 6], 0],
    'sum': [[9, 12, 15], [3, 12, 21], 36]
}
```

## Error Handling

The function raises a `ValueError` with the message `"List must contain nine numbers."` when the input list does not contain exactly nine elements.

## Project Structure

```text
mean-variance-standard-deviation-calculator/
│
├── mean_var_std.py
├── main.py
├── requirements.txt
└── README.md
```

## Installation and Execution

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**2. Navigate to the project directory**

```bash
cd mean-variance-standard-deviation-calculator
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Run the project**

```bash
python3 main.py
```

## Learning Outcomes

Through this project, I gained practical experience in:

- Creating and manipulating NumPy arrays.
- Reshaping arrays into multidimensional matrices.
- Performing statistical calculations using NumPy.
- Understanding array axes and aggregation operations.
- Handling invalid inputs using Python exceptions.

## Acknowledgements

This project was completed as part of the **freeCodeCamp Data Analysis with Python Certification**.

Project Challenge: [Mean-Variance-Standard Deviation Calculator](https://www.freecodecamp.org/learn/data-analysis-with-python/)
