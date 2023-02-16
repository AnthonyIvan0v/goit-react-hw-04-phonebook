import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';
import ContactsForm from 'modules/PhoneBook/ContactsForm/ContactsForm';
import ContactsList from 'modules/PhoneBook/ContactList/ContactList';
import Filter from 'modules/PhoneBook/Filter/Filter';

const App = () => {
  const [contacts, setContacts] = useState(() => {
    const contacts = JSON.parse(localStorage.getItem('my-contacts'));
    return contacts ? contacts : [];
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('my-contacts', JSON.stringify(contacts));
  }, [contacts]);

  const isDuplicate = (name, number) => {
    const normalizedName = name.toLowerCase();
    const newAddedNumber = number;
    const contact = contacts.find(({ name, number }) => {
      return name.toLowerCase() === normalizedName && number === newAddedNumber;
    });
    return Boolean(contact);
  };

  const addContact = ({ name, number }) => {
    if (isDuplicate(name, number)) {
      return alert(`${name} is already in contacts`);
    }
    setContacts(prevContacts => {
      const newContact = {
        id: nanoid(),
        name,
        number,
      };
      return [newContact, ...prevContacts];
    });
  };

  const removeContact = id => {
    setContacts(prevContacts => contacts.filter(item => item.id !== id));
  };
  const handleFilter = ({ target }) => setFilter(target.value);

  const getFiltredContacts = () => {
    if (!filter) {
      return contacts;
    }
    const normalizedFilter = filter.toLowerCase();
    const result = contacts.filter(({ name }) => {
      return name.toLowerCase().includes(normalizedFilter);
    });
    return result;
  };

  const items = getFiltredContacts();
  const isContacts = Boolean(items.length);
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: '#010101',
        flexDirection: 'column',
      }}
    >
      <h1>Phonebook</h1>
      <ContactsForm onSubmit={addContact} />
      <h2>Contacts</h2>
      <Filter handleChange={handleFilter} />
      {isContacts && (
        <ContactsList items={items} removeContact={removeContact} />
      )}
      {!isContacts && <p>No contacts in list</p>}
    </div>
  );
};
export default App;
