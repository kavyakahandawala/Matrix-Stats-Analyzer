from math import sqrt
from numbers import Real
from typing import Sequence


def calculate(numbers: Sequence[Real]) -> dict[str, list[object]]:
    """Calculate population statistics for nine values arranged in a 3x3 grid.

    The returned lists follow the same order as the NumPy version:
    row results, column results, then the result for all nine values.
    """
    if len(numbers) != 9:
        raise ValueError("List must contain nine numbers.")

    if any(not isinstance(number, Real) for number in numbers):
        raise ValueError("All values must be real numbers.")

    matrix = [
        list(numbers[0:3]),
        list(numbers[3:6]),
        list(numbers[6:9]),
    ]
    columns = [
        [matrix[row][column] for row in range(3)]
        for column in range(3)
    ]

    def summary(values: Sequence[Real]) -> dict[str, Real | float]:
        mean = sum(values) / len(values)
        variance = sum((value - mean) ** 2 for value in values) / len(values)
        return {
            "mean": mean,
            "variance": variance,
            "standard deviation": sqrt(variance),
            "max": max(values),
            "min": min(values),
            "sum": sum(values),
        }

    row_summaries = [summary(row) for row in matrix]
    column_summaries = [summary(column) for column in columns]
    overall = summary(numbers)

    return {
        name: [
            [result[name] for result in row_summaries],
            [result[name] for result in column_summaries],
            overall[name],
        ]
        for name in (
            "mean",
            "variance",
            "standard deviation",
            "max",
            "min",
            "sum",
        )
    }
