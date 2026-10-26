import React, { useEffect, useRef, useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import useDetail from '../../hooks/useDetail';
import useFeedback from '../../hooks/useFeedback';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryDetail from '../../components/common/QueryDetail';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { validateProfile } from '../../utils/validators';

export default function EditProfileScreen({ route, navigation }) {
    const { id } = route.params;
    const query = useDetail('students', id, navigation, item => item.fullName);
    const app = useAppData();
    const feedback = useFeedback();
    const initialized = useRef(false);

    const [values, setValues] = useState({
        fullName: '',
        className: '',
        major: '',
        email: '',
        phone: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (query.data && !initialized.current) {
            initialized.current = true;
            setValues({
                fullName: query.data.fullName || '',
                className: query.data.className || '',
                major: query.data.major || '',
                email: query.data.email || '',
                phone: query.data.phone || '',
            });
        }
    }, [query.data]);

    const change = (key, value) => setValues(previous => ({ ...previous, [key]: value }));

    const save = async () => {
        const nextErrors = validateProfile(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length) {
            return;
        }

        setSaving(true);

        await feedback(async () => {
            const trimmed = Object.fromEntries(
                Object.entries(values).map(([key, value]) => [key, value.trim()]),
            );
            await app.updateStudent(id, trimmed);
            navigation.goBack();
        });

        setSaving(false);
    };

    return (
        <ScreenContainer scroll>
            <QueryDetail query={query}>
                <FormInput
                    label="Họ tên"
                    value={values.fullName}
                    onChangeText={value => change('fullName', value)}
                    error={errors.fullName}
                />
                <FormInput
                    label="Lớp"
                    value={values.className}
                    onChangeText={value => change('className', value)}
                />
                <FormInput
                    label="Ngành"
                    value={values.major}
                    onChangeText={value => change('major', value)}
                />
                <FormInput
                    label="Email"
                    value={values.email}
                    onChangeText={value => change('email', value)}
                    keyboardType="email-address"
                    error={errors.email}
                />
                <FormInput
                    label="Số điện thoại"
                    value={values.phone}
                    onChangeText={value => change('phone', value)}
                    keyboardType="phone-pad"
                    error={errors.phone}
                />
                <AppButton title="Lưu thông tin" onPress={save} loading={saving} />
            </QueryDetail>
        </ScreenContainer>
    );
}
