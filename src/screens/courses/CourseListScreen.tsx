import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryList from '../../components/common/QueryList';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import CourseCard from '../../components/course/CourseCard';
import { R } from '../../navigation/routes';

export default function CourseListScreen({ navigation }) {
    const { courses, courseQuery } = useAppData();
    const [search, setSearch] = useState('');
    const [semester, setSemester] = useState('all');

    const semesters = [...new Set(courses.map(item => item.semester))];

    const data = courses.filter(item =>
        item.name.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi')) &&
        (semester === 'all' || item.semester === semester),
    );

    return (
        <ScreenContainer>
            <QueryList
                query={courseQuery}
                data={data}
                emptyTitle="Không tìm thấy môn học phù hợp"
                header={
                    <>
                        <SearchBar value={search} onChangeText={setSearch} />
                        <FilterChips
                            selected={semester}
                            onSelect={setSemester}
                            options={[
                                { label: 'Tất cả học kỳ', value: 'all' },
                                ...semesters.map(value => ({ label: value, value })),
                            ]}
                        />
                    </>
                }
                renderItem={({ item }) => (
                    <CourseCard
                        course={item}
                        onPress={() => navigation.navigate(R.CourseDetail, { id: item.id })}
                    />
                )}
            />
        </ScreenContainer>
    );
}