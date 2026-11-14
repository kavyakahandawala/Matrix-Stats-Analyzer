import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MetricKey =
  | 'mean'
  | 'variance'
  | 'standard deviation'
  | 'max'
  | 'min'
  | 'sum';

type Summary = {
  mean: number;
  variance: number;
  standardDeviation: number;
  max: number;
  min: number;
  sum: number;
};

type MetricValues = {
  rows: number[];
  columns: number[];
  overall: number;
};

type Statistics = Record<MetricKey, MetricValues>;

const METRICS: { key: MetricKey; label: string; note: string }[] = [
  { key: 'mean', label: 'Mean', note: 'Average value' },
  { key: 'variance', label: 'Variance', note: 'Population · ddof 0' },
  {
    key: 'standard deviation',
    label: 'Standard deviation',
    note: 'Population · ddof 0',
  },
  { key: 'max', label: 'Maximum', note: 'Largest value' },
  { key: 'min', label: 'Minimum', note: 'Smallest value' },
  { key: 'sum', label: 'Sum', note: 'Total value' },
];

const EMPTY_VALUES = ['', '', '', '', '', '', '', '', ''];
const SAMPLE_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];

function summarize(values: number[]): Summary {
  const mean = values.reduce((total, value) => total + value, 0) / values.length;
  const variance =
    values.reduce((total, value) => total + (value - mean) ** 2, 0) /
    values.length;

  return {
    mean,
    variance,
    standardDeviation: Math.sqrt(variance),
    max: Math.max(...values),
    min: Math.min(...values),
    sum: values.reduce((total, value) => total + value, 0),
  };
}

function calculateStatistics(values: string[]): Statistics | null {
  if (values.length !== 9 || values.some((value) => value.trim() === '')) {
    return null;
  }

  const numbers = values.map(Number);
  if (!numbers.every(Number.isFinite)) {
    return null;
  }

  const rows = [numbers.slice(0, 3), numbers.slice(3, 6), numbers.slice(6, 9)];
  const columns = [0, 1, 2].map((column) =>
    rows.map((row) => row[column]),
  );
  const rowSummaries = rows.map(summarize);
  const columnSummaries = columns.map(summarize);
  const overall = summarize(numbers);

  const getMetric = (key: MetricKey): MetricValues => {
    const summaryKey: keyof Summary =
      key === 'standard deviation'
        ? 'standardDeviation'
        : (key as keyof Summary);

    return {
      rows: rowSummaries.map((summary) => summary[summaryKey]),
      columns: columnSummaries.map((summary) => summary[summaryKey]),
      overall: overall[summaryKey],
    };
  };

  return {
    mean: getMetric('mean'),
    variance: getMetric('variance'),
    'standard deviation': getMetric('standard deviation'),
    max: getMetric('max'),
    min: getMetric('min'),
    sum: getMetric('sum'),
  };
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    useGrouping: false,
  }).format(value);
}

export default function CalculatorScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const [values, setValues] = useState<string[]>(EMPTY_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const statistics = useMemo(() => calculateStatistics(values), [values]);
  const complete = values.every((value) => value.trim() !== '');
  const canCalculate = complete && statistics !== null;
  const filledCount = values.filter((value) => value.trim() !== '').length;

  const updateValue = (index: number, value: string) => {
    setValues((current) =>
      current.map((currentValue, currentIndex) =>
        currentIndex === index ? value : currentValue,
      ),
    );
    setShowError(false);
  };

  const handleCalculate = () => {
    if (!canCalculate) {
      setShowError(true);
      return;
    }
    setSubmitted(true);
    setShowError(false);
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSample = () => {
    setValues([...SAMPLE_VALUES]);
    setSubmitted(true);
    setShowError(false);
    if (Platform.OS !== 'web') {
      void Haptics.selectionAsync();
    }
  };

  const handleClear = () => {
    setValues([...EMPTY_VALUES]);
    setSubmitted(false);
    setShowError(false);
    if (Platform.OS !== 'web') {
      void Haptics.selectionAsync();
    }
  };

  const helperText = showError
    ? !complete
      ? 'Fill in all nine cells to calculate.'
      : 'Enter a valid number in every cell.'
    : `${filledCount} of 9 values entered · decimals and negatives supported`;

  return (
    <View style={styles.screen}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop:
              insets.top + (Platform.OS === 'web' ? 67 : 14),
            paddingBottom:
              insets.bottom + (Platform.OS === 'web' ? 34 : 24),
          },
        ]}
        bottomOffset={32}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Feather name="grid" size={16} color={colors.primaryForeground} />
          </View>
          <Text style={styles.brandName}>NINE / STATS</Text>
          <View style={styles.brandTag}>
            <Text style={styles.brandTagText}>3 × 3</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>A SMALL TOOL FOR BIG PICTURE THINKING</Text>
          <Text style={styles.title}>
            Mean, variance{'\n'}&amp; everything between.
          </Text>
          <Text style={styles.description}>
            Arrange nine values in a grid. Explore each row, each column, and
            the full set.
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Your matrix</Text>
            <Text style={styles.sectionSubtitle}>
              Nine values, arranged left to right
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear all nine values"
            onPress={handleClear}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.pressed,
            ]}
            testID="clear-values"
          >
            <Feather name="rotate-ccw" size={17} color={colors.mutedForeground} />
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>

        <View style={styles.matrixCard}>
          <View style={styles.matrixTopline}>
            <Text style={styles.matrixLabel}>INPUT VALUES</Text>
            <Text style={styles.matrixHint}>ROW × COLUMN</Text>
          </View>
          {[0, 1, 2].map((row) => (
            <View key={row} style={styles.matrixRow}>
              {[0, 1, 2].map((column) => {
                const index = row * 3 + column;
                return (
                  <View key={index} style={styles.inputCell}>
                    <Text style={styles.cellIndex}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                    <TextInput
                      accessibilityLabel={`Value ${index + 1}, row ${row + 1}, column ${column + 1}`}
                      keyboardType="numbers-and-punctuation"
                      maxLength={16}
                      onChangeText={(value) => updateValue(index, value)}
                      placeholder="—"
                      placeholderTextColor={colors.mutedForeground}
                      returnKeyType={index === 8 ? 'done' : 'next'}
                      selectTextOnFocus
                      style={styles.input}
                      testID={`value-${index + 1}`}
                      value={values[index]}
                    />
                  </View>
                );
              })}
            </View>
          ))}
          <View style={styles.matrixFooter}>
            <Text
              style={[
                styles.helperText,
                showError && styles.errorText,
              ]}
            >
              {helperText}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleSample}
              style={({ pressed }) => [
                styles.sampleButton,
                pressed && styles.pressed,
              ]}
              testID="load-sample"
            >
              <Feather name="zap" size={14} color={colors.accentForeground} />
              <Text style={styles.sampleButtonText}>Load sample</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canCalculate }}
          disabled={!canCalculate}
          onPress={handleCalculate}
          style={({ pressed }) => [
            styles.calculateButton,
            !canCalculate && styles.calculateButtonDisabled,
            pressed && canCalculate && styles.pressed,
          ]}
          testID="calculate-statistics"
        >
          <Text style={styles.calculateButtonText}>Calculate statistics</Text>
          <Feather
            name="arrow-up-right"
            size={18}
            color={colors.primaryForeground}
          />
        </Pressable>

        <View style={styles.resultsHeading}>
          <View>
            <Text style={styles.sectionTitle}>Results</Text>
            <Text style={styles.sectionSubtitle}>
              {submitted ? 'Population statistics · n = 9' : 'Ready when you are'}
            </Text>
          </View>
          {submitted && statistics ? (
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>UPDATED</Text>
            </View>
          ) : null}
        </View>

        {submitted && statistics ? (
          <View style={styles.resultsList}>
            {METRICS.map(({ key, label, note }, index) => {
              const metric = statistics[key];
              return (
                <View key={key} style={styles.resultCard}>
                  <View style={styles.resultTop}>
                    <View style={styles.metricTitleGroup}>
                      <View style={styles.metricNumber}>
                        <Text style={styles.metricNumberText}>
                          {String(index + 1).padStart(2, '0')}
                        </Text>
                      </View>
                      <View style={styles.metricTitleCopy}>
                        <Text style={styles.metricTitle}>{label}</Text>
                        <Text style={styles.metricNote}>{note}</Text>
                      </View>
                    </View>
                    <View style={styles.overallValue}>
                      <Text style={styles.overallLabel}>OVERALL</Text>
                      <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={styles.overallNumber}
                      >
                        {formatNumber(metric.overall)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.resultDivider} />
                  <View style={styles.axisRow}>
                    <Text style={styles.axisLabel}>ROWS</Text>
                    <View style={styles.axisValues}>
                      {metric.rows.map((value, valueIndex) => (
                        <Text key={valueIndex} style={styles.axisValue}>
                          {formatNumber(value)}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <View style={styles.axisRow}>
                    <Text style={styles.axisLabel}>COLUMNS</Text>
                    <View style={styles.axisValues}>
                      {metric.columns.map((value, valueIndex) => (
                        <Text key={valueIndex} style={styles.axisValue}>
                          {formatNumber(value)}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Feather
                name={showError ? 'alert-circle' : 'bar-chart-2'}
                size={20}
                color={showError ? colors.destructive : colors.primary}
              />
            </View>
            <View style={styles.emptyCopy}>
              <Text style={styles.emptyTitle}>
                {showError ? 'Check your values' : 'Your results will appear here'}
              </Text>
              <Text style={styles.emptyDescription}>
                {showError
                  ? helperText
                  : 'Add all nine numbers, then calculate to see each summary.'}
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.footnote}>
          Variance and standard deviation use the population formula (ddof = 0),
          matching NumPy defaults.
        </Text>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 20,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },
    brandMark: {
      width: 30,
      height: 30,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    brandName: {
      color: colors.foreground,
      fontFamily: 'Inter_700Bold',
      fontSize: 12,
      letterSpacing: 1.3,
    },
    brandTag: {
      marginLeft: 'auto',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.accent,
    },
    brandTagText: {
      color: colors.accentForeground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
    },
    intro: {
      marginTop: 28,
      marginBottom: 26,
    },
    eyebrow: {
      color: colors.primary,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 10,
      letterSpacing: 1.25,
      marginBottom: 11,
    },
    title: {
      color: colors.foreground,
      fontFamily: 'Inter_700Bold',
      fontSize: 31,
      lineHeight: 38,
      letterSpacing: -0.9,
    },
    description: {
      color: colors.mutedForeground,
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      lineHeight: 21,
      marginTop: 10,
      maxWidth: 340,
    },
    sectionHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    sectionTitle: {
      color: colors.foreground,
      fontFamily: 'Inter_700Bold',
      fontSize: 18,
      letterSpacing: -0.3,
    },
    sectionSubtitle: {
      color: colors.mutedForeground,
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      marginTop: 3,
    },
    clearButton: {
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 6,
    },
    clearText: {
      color: colors.mutedForeground,
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
    },
    matrixCard: {
      padding: 15,
      borderRadius: colors.radius,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    matrixTopline: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 13,
    },
    matrixLabel: {
      color: colors.mutedForeground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 9,
      letterSpacing: 1.1,
    },
    matrixHint: {
      color: colors.mutedForeground,
      fontFamily: 'Inter_500Medium',
      fontSize: 9,
      letterSpacing: 0.6,
    },
    matrixRow: {
      flexDirection: 'row',
      gap: 9,
      marginBottom: 9,
    },
    inputCell: {
      flex: 1,
      minWidth: 0,
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: colors.secondary,
      borderWidth: 1,
      borderColor: colors.input,
      position: 'relative',
    },
    cellIndex: {
      position: 'absolute',
      top: 7,
      left: 9,
      color: colors.mutedForeground,
      fontFamily: 'Inter_500Medium',
      fontSize: 9,
    },
    input: {
      width: '100%',
      height: '100%',
      textAlign: 'center',
      color: colors.foreground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 21,
      paddingHorizontal: 5,
      paddingTop: 10,
    },
    matrixFooter: {
      minHeight: 36,
      marginTop: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    helperText: {
      flex: 1,
      color: colors.mutedForeground,
      fontFamily: 'Inter_400Regular',
      fontSize: 10,
      lineHeight: 14,
    },
    errorText: {
      color: colors.destructive,
    },
    sampleButton: {
      minHeight: 36,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderRadius: 999,
      paddingHorizontal: 11,
      backgroundColor: colors.accent,
    },
    sampleButtonText: {
      color: colors.accentForeground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 11,
    },
    calculateButton: {
      minHeight: 54,
      marginTop: 14,
      borderRadius: 15,
      paddingHorizontal: 17,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primary,
    },
    calculateButtonDisabled: {
      opacity: 0.42,
    },
    calculateButtonText: {
      color: colors.primaryForeground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
    },
    resultsHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 29,
      marginBottom: 12,
    },
    livePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.accent,
    },
    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
    },
    liveText: {
      color: colors.accentForeground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 9,
      letterSpacing: 0.7,
    },
    resultsList: {
      gap: 10,
    },
    resultCard: {
      padding: 15,
      borderRadius: colors.radius,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    resultTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    metricTitleGroup: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      minWidth: 0,
    },
    metricNumber: {
      width: 28,
      height: 28,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
    },
    metricNumberText: {
      color: colors.accentForeground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 10,
    },
    metricTitleCopy: {
      flex: 1,
      minWidth: 0,
    },
    metricTitle: {
      color: colors.foreground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
    },
    metricNote: {
      color: colors.mutedForeground,
      fontFamily: 'Inter_400Regular',
      fontSize: 10,
      marginTop: 2,
    },
    overallValue: {
      alignItems: 'flex-end',
      maxWidth: 120,
    },
    overallLabel: {
      color: colors.mutedForeground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 8,
      letterSpacing: 1,
      marginBottom: 2,
    },
    overallNumber: {
      color: colors.primary,
      fontFamily: 'Inter_700Bold',
      fontSize: 21,
      letterSpacing: -0.6,
    },
    resultDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 12,
    },
    axisRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 7,
    },
    axisLabel: {
      width: 66,
      color: colors.mutedForeground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 8,
      letterSpacing: 0.8,
    },
    axisValues: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    axisValue: {
      color: colors.cardForeground,
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      fontVariant: ['tabular-nums'],
    },
    emptyCard: {
      minHeight: 92,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      padding: 16,
      borderRadius: colors.radius,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyIcon: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 13,
      backgroundColor: colors.accent,
    },
    emptyCopy: {
      flex: 1,
    },
    emptyTitle: {
      color: colors.foreground,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
    },
    emptyDescription: {
      color: colors.mutedForeground,
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      lineHeight: 16,
      marginTop: 4,
    },
    footnote: {
      color: colors.mutedForeground,
      fontFamily: 'Inter_400Regular',
      fontSize: 10,
      lineHeight: 15,
      textAlign: 'center',
      marginTop: 17,
      paddingHorizontal: 12,
    },
    pressed: {
      opacity: 0.75,
    },
  });
}
