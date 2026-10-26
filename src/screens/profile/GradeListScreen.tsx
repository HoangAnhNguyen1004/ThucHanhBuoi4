import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryList from '../../components/common/QueryList';
import FilterChips from '../../components/common/FilterChips';
import GradeRow from '../../components/grade/GradeRow';
import { R } from '../../navigation/routes';

export default function GradeListScreen({ navigation }: any) {
    const { grades, gradeQuery } = useAppData();
    const [semester, setSemester] = useState('all');
    const semesters = [...new Set(grades.map((grade: any) => grade.semester))];
    const filteredGrades = grades.filter(
        (grade: any) => semester === 'all' || grade.semester === semester,
    );

    return (
        <ScreenContainer>
            <QueryList
                query={gradeQuery}
                data={filteredGrades}
                emptyTitle="Chưa có kết quả học tập"
                header={
                    <FilterChips
                        selected={semester}
                        onSelect={setSemester}
                        options={[
                            { label: 'Tất cả học kỳ', value: 'all' },
                            ...semesters.map((value: string) => ({ label: value, value })),
                        ]}
                    />
                }
                renderItem={({ item }: any) => (
                    <GradeRow
                        grade={item}
                        onPress={() => navigation.navigate(R.GradeDetail, { id: item.id })}
                    />
                )}
            />
        </ScreenContainer>
    );
}
