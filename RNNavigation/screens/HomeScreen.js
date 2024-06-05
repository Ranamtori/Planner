import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function HomeScreen() {
  const [heading, setHeading] = useState('Dzień Dobry Mistrzu!');
  const [subheading, setSubheading] = useState('Czas na nowy dzień 🌞');
  const [instruction, setInstruction] = useState('Pamiętaj o nawodnieniu i zakończeniu sesji chłodnym spacerem i dodatkowym rozciąganiem, aby wspomóc regenerację. Zróbmy dzisiaj coś wspaniałego!');
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [recentExercises, setRecentExercises] = useState([]);
  const [calories, setCalories] = useState({ today: 0, week: 0, month: 0 });
  const [personalBests, setPersonalBests] = useState({ fastest5k: '', heaviestDeadlift: '', longestPlank: '' });
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedHeading = await AsyncStorage.getItem('heading');
        const savedSubheading = await AsyncStorage.getItem('subheading');
        const savedInstruction = await AsyncStorage.getItem('instruction');
        const savedWeeklySchedule = await AsyncStorage.getItem('weeklySchedule');
        const savedRecentExercises = await AsyncStorage.getItem('recentExercises');
        const savedPersonalBests = await AsyncStorage.getItem('personalBests');
        const savedChallenges = await AsyncStorage.getItem('challenges');
        const savedDailyCalories = await AsyncStorage.getItem('dailyCalories');

        if (savedDailyCalories) {
          const parsedDailyCalories = JSON.parse(savedDailyCalories);
          // Oblicz sumę kalorii na dzień, tydzień i miesiąc
          let todayCalories = 0;
          let weekCalories = 0;
          let monthCalories = 0;
          const today = moment().format('YYYY-MM-DD');
          const startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
          const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  
          Object.entries(parsedDailyCalories).forEach(([date, calories]) => {
            if (date === today) {
              todayCalories += parseInt(calories);
            }
            if (moment(date).isSameOrAfter(startOfWeek)) {
              weekCalories += parseInt(calories);
            }
            if (moment(date).isSameOrAfter(startOfMonth)) {
              monthCalories += parseInt(calories);
            }
          });
  
          setCalories({
            today: todayCalories,
            week: weekCalories,
            month: monthCalories,
          });
        }

        if (savedWeeklySchedule) setWeeklySchedule(JSON.parse(savedWeeklySchedule));
        if (savedRecentExercises) setRecentExercises(JSON.parse(savedRecentExercises));
        if (savedPersonalBests) setPersonalBests(JSON.parse(savedPersonalBests));
        if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
        if (savedHeading) setHeading(savedHeading);
        if (savedSubheading) setSubheading(savedSubheading);
        if (savedInstruction) setInstruction(savedInstruction);
      } catch (error) {
        console.error('Failed to load data', error);
      }
    };
    loadData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.dashboard}>
      <View style={styles.profile}>
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.subheading}>{subheading}</Text>
        <Text style={styles.instruction}>{instruction}</Text>
      </View>

      <View style={styles.scheduleTable}>
        <Text style={styles.heading}>Plan Tygodniowy</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Dzień</Text>
            <Text style={styles.cellHeader}>Zaplanowane Ćwiczenie</Text>
            <Text style={styles.cellHeader}>Godzina</Text>
          </View>
          {weeklySchedule.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{item.day}</Text>
              <Text style={styles.cell}>{item.exercise}</Text>
              <Text style={styles.cell}>{item.time}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.exerciseTable}>
        <Text style={styles.heading}>Ostatnie 5 Ćwiczeń</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Ćwiczenie</Text>
            <Text style={styles.cellHeader}>Czas Trwania</Text>
          </View>
          {recentExercises.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{item.exercise}</Text>
              <Text style={styles.cell}>{item.duration}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.calories}>
        <Text style={styles.heading}>Spalone Kalorie</Text>
        <Text><Text style={styles.bold}>Dziś:</Text> {calories.today}</Text>
        <Text><Text style={styles.bold}>W Tym Tygodniu:</Text> {calories.week}</Text>
        <Text><Text style={styles.bold}>W Tym Miesiącu:</Text> {calories.month}</Text>
      </View>

      <View style={styles.personalBests}>
        <Text style={styles.heading}>Najlepsze Wyniki</Text>
        <View>
          <Text>gówno: {personalBests.fastest5k}</Text>
        </View>
      </View>

      <View style={styles.challenges}>
        <Text style={styles.heading}>Wyzwania</Text>
        {challenges.map((challenge, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{challenge}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dashboard: {
    paddingRight: 100,
    paddingLeft: 100,
    paddingTop: 50,
    paddingBottom: 50,
    marginTop: 50,
    marginBottom: 50,
    minWidth: 800,
    maxWidth: 1400,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'lightblue',
  },
  profile: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#FF70A6',
    borderWidth: 3,
    padding: 20,
    boxShadow: '5px 5px 0px 0px #FF70A6',
  },
  scheduleTable: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#FF70A6',
    borderWidth: 3,
    padding: 20,
    boxShadow: '5px 5px 0px 0px #FF70A6',
  },
  exerciseTable: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#FF70A6',
    borderWidth: 3,
    padding: 20,
    boxShadow: '5px 5px 0px 0px #FF70A6',
  },
  calories: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#FF70A6',
    borderWidth: 3,
    padding: 20,
    boxShadow: '5px 5px 0px 0px #FF70A6',
  },
  personalBests: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#FF70A6',
    borderWidth: 3,
    padding: 20,
    boxShadow: '5px 5px 0px 0px #FF70A6',
  },
  challenges: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#FF70A6',
    borderWidth: 3,
    padding: 20,
    boxShadow: '5px 5px 0px 0px #FF70A6',
  },
  heading: {
    fontSize: 24,
    color: '#004D40',
    marginBottom: 10,
  },
  table: {
    width: '100%',
    borderColor: '#957DAD',
    borderWidth: 2,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cellHeader: {
    flex: 1,
    padding: 10,
    backgroundColor: '#957DAD',
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#957DAD',
  },
  cell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#957DAD',
  },
  bold: {
    fontWeight: 'bold',
    color: '#FF5722',
  },
});
