import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryList from '../../components/common/QueryList';
import QueryDetail from '../../components/common/QueryDetail';
import AppButton from '../../components/common/AppButton';
import SyncBadge from '../../components/common/SyncBadge';
import InfoRow from '../../components/profile/InfoRow';
import GpaSummary from '../../components/grade/GpaSummary';
import { calcGpa } from '../../utils/gpa';
import { R } from '../../navigation/routes';

export default function ProfileScreen({ navigation }) {
    const app = useAppData();
    const student = app.student;
    const summary = calcGpa(app.grades, app.courses);

    const rows = student ? [
        { id: 'studentCode', label: 'Mã sinh viên', value: student.studentCode },
        { id: 'fullName', label: 'Họ tên', value: student.fullName },
        { id: 'className', label: 'Lớp', value: student.className },
        { id: 'major', label: 'Ngành', value: student.major },
        { id: 'email', label: 'Email', value: student.email },
        { id: 'phone', label: 'Số điện thoại', value: student.phone },
    ] : [];

    const query = {
        ...app.studentQuery,
        refreshing:
            app.studentQuery.refreshing ||
            app.gradeQuery.refreshing ||
            app.courseQuery.refreshing,
        refresh: () => Promise.all([
            app.studentQuery.refresh(),
            app.gradeQuery.refresh(),
            app.courseQuery.refresh(),
        ]),
    };

    return (
        <ScreenContainer>
            <QueryList
                query={query}
                data={rows}
                header={
                    <>
                        <SyncBadge pending={app.isPending('students', 1)} />

                        <AppButton
                            title="Chỉnh sửa thông tin"
                            disabled={!student}
                            onPress={() => navigation.navigate(R.EditProfile, { id: student.id })}
                        />

                        <QueryDetail query={app.gradeQuery}>
                            <GpaSummary gpa={summary.gpa} totalCredits={summary.totalCredits} />
                        </QueryDetail>

                        <AppButton
                            title="Xem điểm theo học kỳ"
                            variant="outline"
                            onPress={() => navigation.navigate(R.GradeList)}
                        />
                    </>
                }
                renderItem={({ item }) => <InfoRow label={item.label} value={item.value} />}
            />
        </ScreenContainer>
    );
}