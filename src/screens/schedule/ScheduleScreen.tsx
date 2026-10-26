import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryList from '../../components/common/QueryList';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import { todayDay } from '../../utils/date';
import { R } from '../../navigation/routes';

export default function ScheduleScreen({ navigation }) {
    const { sessions, sessionQuery } = useAppData();
    const [day, setDay] = useState(todayDay());

    const data = sessions
        .filter(item => Number(item.dayOfWeek) === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <ScreenContainer>
            <QueryList
                query={sessionQuery}
                data={data}
                emptyTitle="Không có lịch học trong ngày này"
                header={<DaySelector selectedDay={day} onSelectDay={setDay} />}
                renderItem={({ item }) => (
                    <SessionCard
                        session={item}
                        onPress={() => navigation.navigate(R.SessionDetail, { id: item.id })}
                    />
                )}
            />
        </ScreenContainer>
    );
}