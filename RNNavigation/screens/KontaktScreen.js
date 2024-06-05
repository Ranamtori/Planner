import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native-web';

function KontaktScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true); // State to track email validation

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Walidacja adresu email przy każdej zmianie
  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(validateEmail(text)); // Aktualizacja stanu isValidEmail
  };

  const onSubmit = (e) => {
    e.preventDefault(); // Zapobiegamy domyślnej akcji wysłania formularza
  
    // Resetujemy komunikaty błędów
    setNameError('');
    setEmailError('');
    setSubjectError('');
    setMessageError('');
    setResultMessage('');

    // Sprawdzamy, czy wszystkie wymagane pola są wypełnione i czy adres email jest poprawny
    let formValid = true;
    if (!name) {
      setNameError('Pole "Imię" jest wymagane.');
      formValid = false;
    }
    if (!email) {
      setEmailError('Pole "Email" jest wymagane.');
      formValid = false;
    } else if (!isValidEmail) {
      setEmailError('Podaj poprawny adres email.');
      formValid = false;
    }
    if (!subject) {
      setSubjectError('Pole "Temat" jest wymagane.');
      formValid = false;
    }
    if (!message) {
      setMessageError('Pole "Wiadomość" jest wymagane.');
      formValid = false;
    }

    if (!formValid) {
      return; // Zakończ funkcję onSubmit, jeśli formularz nie jest poprawnie wypełniony
    }
  
    setIsLoading(true);
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        subject,
        message
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(data => {
        setResultMessage('Wiadomość została wysłana');
        console.log(data);
      })
      .catch(error => {
        setResultMessage('Wystąpił błąd podczas wysyłania formularza.');
        console.error('Error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Napisz do nas!</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Imię"
          value={name}
          onChangeText={setName}
          required
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        <TextInput
          style={[styles.input, !isValidEmail && styles.invalidInput]} // Stylizacja dla nieprawidłowego adresu email
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange} // Obsługa zmiany adresu email
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Temat"
          value={subject}
          onChangeText={setSubject}
          required
        />
        {subjectError ? <Text style={styles.errorText}>{subjectError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Wiadomość"
          value={message}
          onChangeText={setMessage}
          multiline
          required
        />
        {messageError ? <Text style={styles.errorText}>{messageError}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Wysyłanie...' : 'Wyślij'}</Text>
        </TouchableOpacity>
      </View>
      {resultMessage && <Text style={styles.resultMessage}>{resultMessage}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 50,
    paddingTop: 50,
    minWidth: 800,
    maxWidth: 1400,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: "#82ac85"
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f5f5f5'
  },
  form: {
    width: '90%',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#a9c7ac',
  },
  invalidInput: {
    borderColor: 'red', // Zmiana koloru ramki dla nieprawidłowego adresu email
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#d9aca5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  resultMessage: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});

export default KontaktScreen;
