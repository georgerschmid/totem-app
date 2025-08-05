import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, FlatList, Alert} from 'react-native';

/**
 * FriendsScreen shows a list of the user’s friends and provides a simple
 * interface to add new friends by email.  In a production app you would
 * synchronize this list with a backend (e.g. Firestore).  When a friend
 * shares their location they will appear on the Map screen.
 */
const FriendsScreen: React.FC = () => {
  const [friends, setFriends] = useState<string[]>(['Alice', 'Bob']);
  const [email, setEmail] = useState('');

  const addFriend = () => {
    if (!email) return;
    // In a real app you would send an invitation to the backend here.
    setFriends([...friends, email]);
    Alert.alert('Invitation sent', `${email} has been added to your friend list.`);
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item}
        renderItem={({item}) => <Text style={styles.friendItem}>{item}</Text>}
        style={{flex: 1, alignSelf: 'stretch'}}
      />
      <TextInput
        style={styles.input}
        placeholder="Friend's email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Add Friend" onPress={addFriend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  friendItem: {
    fontSize: 18,
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginVertical: 12,
  },
});

export default FriendsScreen;