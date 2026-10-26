import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import useFeedback from '../../hooks/useFeedback';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import QueryDetail from '../../components/common/QueryDetail';
import EmptyState from '../../components/common/EmptyState';
import { validateAssignment } from '../../utils/validators';
import { parseLocalDateTime } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentFormScreen({ navigation }) {
    const app = useAppData();
    const feedback = useFeedback();
    const [values, setValues] = useState({
        title: '',
        description: '',
        courseId: null,
        dueDate: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const change = (key, value) => setValues(previous => ({ ...previous, [key]: value }));

    const save = async () => {
        const nextErrors = validateAssignment(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length) {
            return;
        }

        setSaving(true);

        await feedback(async () => {
            await app.createAssignment({
                title: values.title.trim(),
                description: values.description.trim(),
                courseId: values.courseId,
                dueDate: parseLocalDateTime(values.dueDate).toISOString(),
            });
            navigation.goBack();
        });

        setSaving(false);
    };

    return (
        <ScreenContainer scroll>
            <FormInput
                label="Tiêu đề"
                value={values.title}
                onChangeText={value => change('title', value)}
                error={errors.title}
            />

            <FormInput
                label="Mô tả"
                value={values.description}
                onChangeText={value => change('description', value)}
                multiline
            />

            <Text style={styles.label}>Môn học</Text>
            <QueryDetail query={app.courseQuery}>
                {app.courses.length ? (
                    <FilterChips
                        options={app.courses.map(item => ({ label: item.name, value: item.id }))}
                        selected={values.courseId}
                        onSelect={value => change('courseId', value)}
                    />
                ) : (
                    <EmptyState title="Chưa có môn học để chọn" />
                )}
            </QueryDetail>
            {errors.courseId ? <Text style={styles.error}>{errors.courseId}</Text> : null}

            <FormInput
                label="Hạn nộp (dd/MM/yyyy HH:mm)"
                value={values.dueDate}
                onChangeText={value => change('dueDate', value)}
                placeholder="09/11/2026 23:59"
                error={errors.dueDate}
            />

            <AppButton title="Lưu bài tập" onPress={save} loading={saving} />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    label: { ...typography.button, color: colors.text, marginTop: spacing.lg },
    error: { ...typography.caption, color: colors.danger },
});
