import React, { useState, useEffect } from 'react';
import { Client, Databases, ID } from 'appwrite';
import { StyleSheet, TextInput, Button, View, Text, FlatList, Alert,ScrollView,TouchableOpacity } from 'react-native';
import { appwriteConfig } from '../../lib/appwrite';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const phoneNumbers = ['+94779178033', '+94778045801'];

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite endpoint
  .setProject(appwriteConfig.projectId); // Your project ID

const databases = new Databases(client);

const Gadians = () => {
  const [isSubmitting, setSubmitting] = useState(false)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');  // Store phone as a string
  const [contacts, setContacts] = useState([]); // Store fetched contacts
  const [selectedContact, setSelectedContact] = useState(null);
  const [documentId, setDocumentId] = useState('');
  // Fetch contacts from Appwrite
  const fetchContacts = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.guardianscollectionId
      );
      console.log('Fetched Contacts:', response.documents); // Debugging: Log the contacts
      setContacts(response.documents); // Set contacts to state
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };
  const fetchDocument = async (id) => {
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.guardianscollectionId,
        id // Document ID
      );
      console.log('Fetched Document:', response);
      setName(response.name); // Set name to state
      setPhone(response.phone); // Set phone to state
      setDocumentId(response.$id); // Set the document ID for updating
    } catch (error) {
      console.error('Failed to fetch document:', error);
    }
  };

  // Function to add contact
  const saveContact = async () => {
    // Validate phone number as a string, ensure it's not empty
    if (!phone.match(/^[0-9]+$/)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid numeric phone number.');
      return;
    }

    try {
      if (documentId) {
        // Update existing contact
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.guardianscollectionId,
          documentId, // Use the ID of the selected contact for update
          {
            name: name,
            phone: phone, // Store phone as string
          }
        );
        console.log('Contact updated successfully');
      } else {
        // Add a new contact
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.guardianscollectionId,
          ID.unique(), // Unique document ID
          {
            name: name,
            phone: phone, // Store phone as string
          }
        );
        console.log('Contact added successfully');
      }
      // Reset the form and fetch updated contact list
      setName('');
      setPhone('');
      setDocumentId(''); // Reset document ID
      fetchContacts();
    } catch (error) {
      console.error('Failed to save contact:', error);
    }
  };
  const editContact = (contact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setSelectedContact(contact); // Store the selected contact
  };
  const deleteContact = async (id) => {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.guardianscollectionId,
        id // Document ID to delete
      );
      console.log('Contact deleted successfully');
      // Refresh the contact list after deletion
      fetchContacts();
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  // Fetch contacts when the component mounts
  useEffect(() => {
    fetchContacts(); // Fetch saved contacts when component loads
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FBDFDBFF' }}>
    
    
    <View style={styles.container}>
      {/* Contact Form */}
      <FormField
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName} // Store name as is
      />
      <FormField
        style={styles.input}
        placeholder="Phone"
        value={phone}  // Store phone as string in state
        onChangeText={setPhone}  // Store phone as string
        keyboardType="numeric"  // Ensure numeric input
      />
      <Text></Text>
      <CustomButton
            title={selectedContact ? "Update Contact" : "Add Contact"}
            handlePress={saveContact}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            
          />
      {/* Debugging: Display contact count */}
      <Text className="text-3xl font-semibold  text-pink-900 mt-10 font-psemibold" >Number of Contacts: {contacts.length}</Text>
      
      {/* Contact List */}
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => item.$id || `${item.name}-${index}`}  // Fallback if $id is missing
        renderItem={({ item }) => {
          console.log(item); // Log each contact for debugging
          return (
            <View style={styles.contactItem}>
              <Text className="text-4xl text-red-950  font-pregular text-left"> {item.name}</Text>
              <Text className="text-2xl text-red-950 font-pregular text-left">Phone: {item.phone}</Text>
              <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => editContact(item)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteContact(item.$id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No contacts available</Text>
        )}
      />
    </View>
    <StatusBar backgroundColor="#FBDFDBFF" style="#4F2730" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  editButtonText: {
    color: 'white',
  },
  deleteButtonText: {
    color: 'white',
  },
  contactItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row', // Set the contact item to display in a row
    justifyContent: 'space-between', // Space out contact info and buttons
    alignItems: 'center', // Align items vertically in the center
  },
  contactInfo: {
    flex: 1, // Allow the contact info to take available space
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons in a row
  },
  contactItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contactText: {
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#761228FF',
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
    minHeight: 5,
    width: 95,
  },
  deleteButton: {
    backgroundColor: '#4F2730',
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
    minHeight: 5,
    width: 95,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});

export default Gadians;
