import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

export default function PlannerScreen() {
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [recentExercises, setRecentExercises] = useState([]);
  const [personalBests, setPersonalBests] = useState({ fastest5k: '', heaviestDeadlift: '', longestPlank: '' });
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState('');
  const [editedChallenges, setEditedChallenges] = useState({});
  const [newExercise, setNewExercise] = useState({ exercise: '', duration: '' });
  const [newSchedule, setNewSchedule] = useState({ day: '', exercise: '', time: '' });
  const [calories, setCalories] = useState({ today: 0, week: 0, month: 0 });
  const [dailyCalories, setDailyCalories] = useState({});
  const [newCalories, setNewCalories] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [bestCaloriesDay, setBestCaloriesDay] = useState('');
  const [bestExerciseDay, setBestExerciseDay] = useState('');
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [heading, setHeading] = useState('Dzień Dobry Mistrzu!');
  const [subheading, setSubheading] = useState('Czas na nowy tydzień 🌞');
  const [instruction, setInstruction] = useState('Pamiętaj o nawodnieniu i zakończeniu sesji chłodnym spacerem i dodatkowym rozciąganiem, aby wspomóc regenerację. Miłego dnia!');


  useEffect(() => {
    const loadData = async () => {
      try {
        const savedWeeklySchedule = await AsyncStorage.getItem('weeklySchedule');
        const savedRecentExercises = await AsyncStorage.getItem('recentExercises');
        const savedCalories = await AsyncStorage.getItem('calories');
        const savedPersonalBests = await AsyncStorage.getItem('personalBests');
        const savedChallenges = await AsyncStorage.getItem('challenges');
        const savedHeading = await AsyncStorage.getItem('heading');
        const savedSubheading = await AsyncStorage.getItem('subheading');
        const savedInstruction = await AsyncStorage.getItem('instruction');
        const savedDailyCalories = await AsyncStorage.getItem('dailyCalories');

        if (savedWeeklySchedule) setWeeklySchedule(JSON.parse(savedWeeklySchedule));
        if (savedRecentExercises) setRecentExercises(JSON.parse(savedRecentExercises));
        if (savedCalories) setCalories(JSON.parse(savedCalories));
        if (savedPersonalBests) setPersonalBests(JSON.parse(savedPersonalBests));
        if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
        if (savedHeading) setHeading(savedHeading);
        if (savedSubheading) setSubheading(savedSubheading);
        if (savedInstruction) setInstruction(savedInstruction);
        if (savedCalories) setCalories(JSON.parse(savedCalories));
        if (savedDailyCalories) setDailyCalories(JSON.parse(savedDailyCalories));

      } catch (error) {
        console.error('Failed to load data', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('weeklySchedule', JSON.stringify(weeklySchedule));
        await AsyncStorage.setItem('recentExercises', JSON.stringify(recentExercises));
        await AsyncStorage.setItem('calories', JSON.stringify(calories));
        await AsyncStorage.setItem('personalBests', JSON.stringify(personalBests));
        await AsyncStorage.setItem('challenges', JSON.stringify(challenges));
        await AsyncStorage.setItem('heading', heading);
        await AsyncStorage.setItem('subheading', subheading);
        await AsyncStorage.setItem('instruction', instruction);
        await AsyncStorage.setItem('dailyCalories', JSON.stringify(dailyCalories));
      } catch (error) {
        console.error('Failed to save data', error);
      }
    };
    saveData();
  }, [weeklySchedule, recentExercises, calories, personalBests, challenges, heading, subheading, instruction, dailyCalories]);

  
  useEffect(() => {
    const calculateTotals = () => {
      const weekStart = moment().startOf('week');
      const weekEnd = moment().endOf('week');
      const monthStart = moment().startOf('month');
      const monthEnd = moment().endOf('month');
    
      let weekTotal = 0;
      let monthTotal = 0;
      let maxCaloriesDate = null;
      let maxExerciseDate = null;
      let maxCalories = 0;
      let maxExerciseDuration = 0;
    
      for (let date in dailyCalories) {
        const calorieDate = moment(date);
        const calories = parseInt(dailyCalories[date]) || 0;
    
        if (calorieDate.isBetween(weekStart, weekEnd, null, '[]')) {
          weekTotal += calories;
        }
        if (calorieDate.isBetween(monthStart, monthEnd, null, '[]')) {
          monthTotal += calories;
        }
    
        if (calories > maxCalories) {
          maxCalories = calories;
          maxCaloriesDate = date;
        }
      }
    

      recentExercises.forEach((exercise) => {
        const duration = parseInt(exercise.duration) || 0;
        if (duration > maxExerciseDuration) {
          maxExerciseDuration = duration;
          maxExerciseDate = moment().format('YYYY-MM-DD');
        }
      });
    
      setWeeklyTotal(weekTotal);
      setMonthlyTotal(monthTotal);
      setBestCaloriesDay(maxCaloriesDate);
      setBestExerciseDay(maxExerciseDate);
    };    

    calculateTotals();
  }, [dailyCalories]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const addCalories = () => {
    if (newCalories) {
      const updatedDailyCalories = { ...dailyCalories, [selectedDate]: newCalories };
      setDailyCalories(updatedDailyCalories);
      setNewCalories('');
      // Zapisz dane kalorii w AsyncStorage
      AsyncStorage.setItem('dailyCalories', JSON.stringify(updatedDailyCalories)).catch(error => {
        console.error('Failed to save daily calories', error);
      });
    } else {
      Alert.alert('Błąd', 'Proszę wprowadzić liczbę spalonych kalorii');
    }
  };
  
  
  const removeCalories = (date) => {
    const updatedCalories = { ...dailyCalories };
    delete updatedCalories[date];
    setDailyCalories(updatedCalories);
  };
  

  const addExercise = () => {
    if (newExercise.exercise && newExercise.duration) {
      setRecentExercises([...recentExercises, newExercise]);
      setNewExercise({ exercise: '', duration: '' });
    } else {
      Alert.alert('Błąd', 'Proszę wprowadzić ćwiczenie i czas trwania');
    }
  };

  const removeExercise = (index) => {
    const updatedExercises = [...recentExercises];
    updatedExercises.splice(index, 1);
    setRecentExercises(updatedExercises);
  };

  const editExercise = (index) => {
    const updatedExercises = [...recentExercises];
    updatedExercises[index] = newExercise;
    setRecentExercises(updatedExercises);
    setNewExercise({ exercise: '', duration: '' });
  };


  const addSchedule = () => {
    if (newSchedule.day && newSchedule.exercise && newSchedule.time) {
      setWeeklySchedule([...weeklySchedule, newSchedule]);
      setNewSchedule({ day: '', exercise: '', time: '' });
    } else {
      Alert.alert('Błąd', 'Proszę wprowadzić dzień, ćwiczenie i godzinę');
    }
  };

  const saveChallenges = async (challenges) => {
    try {
      await AsyncStorage.setItem('challenges', JSON.stringify(challenges));
    } catch (error) {
      console.error('Failed to save challenges', error);
    }
  };

  const addChallenge = () => {
    const updatedChallenges = [...challenges, newChallenge];
    setChallenges(updatedChallenges);
    setNewChallenge('');
    saveChallenges(updatedChallenges);
  };

  const removeChallenge = (index) => {
    const updatedChallenges = challenges.filter((_, i) => i !== index);
    setChallenges(updatedChallenges);
    saveChallenges(updatedChallenges);
  };

  const editChallenge = (index) => {
    const updatedChallenges = challenges.map((challenge, i) => 
      i === index ? editedChallenges[index] : challenge
    );
    setChallenges(updatedChallenges);
    saveChallenges(updatedChallenges);
    const updatedEditedChallenges = { ...editedChallenges };
    delete updatedEditedChallenges[index];
    setEditedChallenges(updatedEditedChallenges);
  };

  const removeSchedule = (index) => {
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule.splice(index, 1);
    setWeeklySchedule(updatedSchedule);
  };

  const editSchedule = (index) => {
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[index] = newSchedule;
    setWeeklySchedule(updatedSchedule);
    setNewSchedule({ day: '', exercise: '', time: '' });
  };

  

  return (
    <ScrollView contentContainerStyle={styles.dashboard}>
      <View style={styles.powitanie}>
        <Text style={styles.cotujest_title}>Cześć czołem!</Text>
        <Text style={styles.cotujest_text}>Tutaj możesz edytować swój planer. Uzupełnij zaplanwoane na ten tydzień ćwiczenia oraz dodaj jakie już wykonałeś/łaś. Nie zapomnij dodać ile kalorii dzisiaj spaliłeś/łaś, żebyśmy mogli je potem podliczyć. Możesz też dodawać, edytować i usuwać swoje wyzwania. Miłego planowania!</Text>
      </View>

      <View style={styles.profile}>
        <TextInput
          style={styles.heading}
          value={heading}
          onChangeText={setHeading}
        />
        <TextInput
          style={styles.subheading}
          value={subheading}
          onChangeText={setSubheading}
        />
        <TextInput
          style={styles.instruction}
          value={instruction}
          onChangeText={setInstruction}
          multiline
        />
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
          <TextInput
            style={styles.cell}
            value={item.day}
            onChangeText={(text) => {
              const updatedSchedule = [...weeklySchedule];
              updatedSchedule[index].day = text;
              setWeeklySchedule(updatedSchedule);
            }}
          />
          <TextInput
            style={styles.cell}
            value={item.exercise}
            onChangeText={(text) => {
              const updatedSchedule = [...weeklySchedule];
              updatedSchedule[index].exercise = text;
              setWeeklySchedule(updatedSchedule);
            }}
          />
          <TextInput
            style={styles.cell}
            value={item.time}
            onChangeText={(text) => {
              const updatedSchedule = [...weeklySchedule];
              updatedSchedule[index].time = text;
              setWeeklySchedule(updatedSchedule);
            }}
          />
          <TouchableOpacity onPress={() => removeSchedule(index)} style={styles.deleteButton}>
            <Text style={{ color: 'red', padding: 10 }}>Usuń</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => editSchedule(index)} style={styles.editButton}>
            <Text style={{ color: 'green', padding: 10 }}>Edytuj</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>


        <Text style={styles.subheading}>Dodaj Nowe Ćwiczenie:</Text>
        <Picker
          selectedValue={newSchedule.day}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => setNewSchedule({ ...newSchedule, day: itemValue })}
          >
            <Picker.Item label="Wybierz dzień" value="" />
            <Picker.Item label="Poniedziałek" value="Poniedziałek" />
            <Picker.Item label="Wtorek" value="Wtorek" />
            <Picker.Item label="Środa" value="Środa" />
            <Picker.Item label="Czwartek" value="Czwartek" />
            <Picker.Item label="Piątek" value="Piątek" />
            <Picker.Item label="Sobota" value="Sobota" />
            <Picker.Item label="Niedziela" value="Niedziela" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Ćwiczenie"
            value={newSchedule.exercise}
            onChangeText={(text) => setNewSchedule({ ...newSchedule, exercise: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Godzina"
            value={newSchedule.time}
            onChangeText={(text) => setNewSchedule({ ...newSchedule, time: text })}
          />
          <Button title="Dodaj do Planu" onPress={addSchedule} />
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
                  <TouchableOpacity onPress={() => removeExercise(index)} style={styles.deleteButton}>
                    <Text style={{ color: 'red', padding: 10 }}>Usuń</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editExercise(index)} style={styles.editButton}>
                    <Text style={{ color: 'green', padding: 10 }}>Edytuj</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <Text style={styles.subheading}>Dodaj Nowe Ćwiczenie:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ćwiczenie"
              value={newExercise.exercise}
              onChangeText={(text) => setNewExercise({ ...newExercise, exercise: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Czas Trwania"
              value={newExercise.duration}
              onChangeText={(text) => setNewExercise({ ...newExercise, duration: text })}
            />
            <Button title="Dodaj Ćwiczenie" onPress={addExercise} />
          </View>


          <View style={styles.calories}>
        <Text style={styles.heading}>Spalone kalorie</Text>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{ [selectedDate]: { 
            selected: true, 
            selectedColor: 'pink',
           } }}
        />
        <Text style={styles.selectedDate}>Wybrana data: {selectedDate}</Text>
        <TextInput
          style={styles.input}
          value={newCalories}
          onChangeText={setNewCalories}
          placeholder="Spalone kalorie"
          keyboardType="numeric"
        />
        <Button title="Dodaj kalorie" onPress={addCalories} />
        <View style={styles.totals}>
              <Text>
                <Text style={styles.bold}>Spalone Kalorie w tym tygodniu: </Text>
                <Text>{weeklyTotal}</Text>
              </Text>
              <Text>
                <Text style={styles.bold}>Spalone Kalorie w tym miesiącu: </Text>
                <Text>{monthlyTotal}</Text>
              </Text>
        </View>

          {Object.keys(dailyCalories).map((date) => (
            <View key={date} style={styles.calorieEntry}>
              <Text style={styles.entryText}>{date}: {dailyCalories[date]} kcal</Text>
              <TouchableOpacity onPress={() => removeCalories(date)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Usuń</Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>

      <View style={styles.personalBests}>
        <Text style={styles.heading}>Najlepsze Wyniki</Text>
        <Text>Dzień z największą ilością spalonych kalorii: {bestCaloriesDay}</Text>
        <Text>Dzień z najdłuższym czasem wykonywanych ćwiczeń w obecnym tygodniu: {bestExerciseDay}</Text>
      </View>

      <View style={styles.challenges}>
        <Text style={styles.heading}>Wyzwania</Text>
        {challenges.map((challenge, index) => (
          <View key={index} style={styles.row_wyzwania}>
            <TextInput
              style={styles.cell}
              value={editedChallenges[index] || challenge}
              onChangeText={(text) => {
                const updatedChallenges = { ...editedChallenges };
                updatedChallenges[index] = text;
                setEditedChallenges(updatedChallenges);
              }}
            />
            <TouchableOpacity onPress={() => editChallenge(index)}>
              <Text style={{ color: 'green', marginLeft: 10 }}>Zapisz</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeChallenge(index)}>
              <Text style={{ color: 'red', marginLeft: 10 }}>Usuń</Text>
            </TouchableOpacity>
          </View>
        ))}
  
        <Text style={styles.subheading}>Dodaj Wyzwanie:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Wyzwanie"
            value={newChallenge}
            onChangeText={setNewChallenge}
          />
          <Button title="Dodaj Wyzwanie" onPress={addChallenge} />
        </View>
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
    backgroundColor: '#F4C2C2',
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
  subheading: {
    fontSize: 18,
    color: '#004D40',
    marginBottom: 10,
    marginTop: 20,
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
  row_wyzwania: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
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
  input: {
    borderWidth: 1,
    borderColor: '#957DAD',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
    color: '#FF5722',
  },
  powitanie: {
    width: "60%",
    backgroundColor: '#f5f5f5',
    borderColor: '#FF70A6',
    borderWidth: 5,
    padding: 20,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 50
  },
  cotujest_title: {
    fontSize: 20,
    color: "#A94064",
    alignSelf: "center",
    marginBottom: 10
  },
  cotujest_text: {
    color: "#A94064",
    alignSelf: "center"
  },
  calorieEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  entryText: {
    flex: 1,
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center'
  },
});
