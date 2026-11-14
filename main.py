import json

from mean_var_std import calculate


def main() -> None:
    raw_values = input(
        "Enter nine numbers separated by spaces or commas: "
    )
    try:
        values = [
            float(value)
            for value in raw_values.replace(",", " ").split()
        ]
        results = calculate(values)
    except ValueError as error:
        print(f"Error: {error}")
        return

    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
