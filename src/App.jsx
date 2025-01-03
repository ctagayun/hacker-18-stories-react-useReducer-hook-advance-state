/*================================================================
 React Advance State Reducer Hook
   see: https://www.robinwieruch.de/react-state-usereducer-usestate-usecontext/

   How to useReducer in React: https://www.robinwieruch.de/react-usereducer-hook/
   Task: 

    1. In this section, we will move the stateful 'STORIES' from React's 
  useState hook to React's useReducer hook. In this section, we will start  
  to manage the "stories and its state transitions "in a reducer. Reducer
  enables sophisticated state management.
    
    2. Use reducer to msnage state if there are multiple states related
  to one domain that are related to each other. For example:
       - stories (see )
       - isLogging
       - isError
  are all related to the "data fetching"

     Basically reducers are there to manage state in an application. 
  For instance, if a user writes something in an HTML input field, the 
  application has to manage this UI state (e.g. controlled components).

    In essence, a reducer is a function which takes two arguments:
       - the current state  
       - an action 
   and returns a new state based on both arguments values.

     Using useReducer over useState makes sense when  multiple stateful 
  values are dependent on each other or related to one domain. For example, 
  stories, isLoading, and error are all related to the "data fetching". 
  In all three (e.g. data, isLoading, error) could be properties in one 
  complex object managed by a reducer instead.
  
  
  Hints on how to accomplish Task:
    - First, introduce a reducer function OUTSIDE of your components and 
    call it stories reducer. 
    A reducer function always receives a state and an action. Based 
    on these two arguments, a reducer always returns a new state:

  Review what is useState?
      - https://www.robinwieruch.de/react-usestate-hook/

      - When a state gets mutated, the component with the state 
      and all child components will re-render.

  Review what is useEffect?
    - https://www.robinwieruch.de/react-useeffect-hook/
    
    - What does useEffect do? by using this hook you tell React that 
     your component needs to do something after render.

  Review what is a React.Reducer
    - https://www.robinwieruch.de/javascript-reducer/

=============================================*/
import * as React from 'react';

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

/*Asynchronous data. We start off by writing getAsyncStories a function that returns 
  a "Promise" with a data.
  The resolve object holds the previous list of stories
*/
const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }), 
      2000
    )
  );

/*
  First, introduce a reducer function outside of your components. 
  A reducer function always receives a state and an action (A). 
  Based on these two arguments, a reducer always returns a new state:
    1. 'action' is always associated with a type (B) and payload (B)
    2. If the type matches a condition in the reducer (B), return a new state (C) 
      based on incoming state and action.
  */

  //In the following example: 
  //The storiesReducer function covers "one type" and then returns the 
  //payload of the incoming action without using the current state to 
  //compute the new state. The new state is therefore simply the payload.

  //   const storiesReducer = (state, action) => {
  //     if (action.type === 'SET_STORIES') {
  //       return action.payload; //the new state is simply the payload
  //     } else {
  //       throw new Error();
  //     }
  //   };
 
 //Define a reducer function. It always receives state and action
 //   1.'action' is always associated with a type. In this example
 //     there are 2 types: 'SET_STORIES' and 'REMOVE_STORY' 
 //     each type returns appropriate action.payload.
 //
 //   2. If the type matches a condition  in this case 'SET_STORIES' 
 //      and 'REMOVE_STORY' the reducer return a new state based on 
 //       incoming state and action.
 //   3. Based on these two arguments the reducer always returns 
 //     a new state
 
 //storiesReducer function is the first parameter of useReducer hook.
 const storiesReducer = (state, action) => { // A
  switch (action.type) {  //(B)
    case 'SET_STORIES':   
      return action.payload;  //return a new state
    case 'REMOVE_STORY':  //(C)
      return state.filter(   //return a new state
                             //but filter the state first. In this case objectID. 
                             //Filter generates 
                             //a new array from the 'state' an call it "story"
        (story) => action.payload.objectID !== story.objectID //C
      );
    default:
      throw new Error(); //Error! action type is not  SET_STORIES or REMOVE_STORY
  }
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  /*
    Create a variables to manage state using React.useState hook:

    By using useState, we are telling React that we want to 
    have a stateful value which changes over time.  
    Since we haven't fetch the data yet, initialize the state 
    'stories'with empty array and simulate fetching these stories 
    async.
    const [stories, setStories] = React.useState([]); (C)
  /*

  /* Replace above React.useState with React.useReducer hook.
     The hook receives a reducer function storiesReducer (A) 
     and initial state (B) as arguments.
     It and returns an array with two items. 
       1. The first item is the current state 
       2  The second item is the state updater function 
          (also called dispatch function):
    The new dispatch function can be used instead of the 
    setStories (C) function , which was previously returned 
    from useState version of the hook.
  */

  //This initializes or setup the initial state of "stories" to an empty list
  //Refactor the following to use React.useReducer hook. We want an empty list 
  //of stories "[]" for the initial state
 
  /*const [stories, setStories] = React.useState([]); */

  //Same as in React.useState, the reducer initializes "stories" with an empty list
  const [stories, dispatchStories] = React.useReducer(
      storiesReducer, //parameter 1 -this the reducer function defined above.  
      []  //parameter 2 is the initial state. In this case an empty array
    );
    //Instead of setting the state explicitly (like what the 
    //useState updater function 'setStories' does) the
    //updater function from , the useReducer  update  
    //function called 'dispatchStories' sets the state implicitly 
    //by dispatching an action for the reducer. See 
    //getAsyncStories() below. 

  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  //In the useEffect hook we call getAsyncStories a function that 
  //returns "Promise" with a data (see line 80) and resolve the returned
  //promisea as a side-effect.
  //Due to the empty dependency array, the side-effect only runs once 
  //the component renders for the first time:
  React.useEffect(() => {
    setIsLoading(true);
    getAsyncStories()
      .then((result) => {
        dispatchStories({ // (A) Updater function sets state implicitly
                          //by dispatching an action for the reducer it takes 2 args.
          type: 'SET_STORIES',  //  type
          payload: result.data.stories, //'action'
        });
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  //This handler computes the new stories. It is the second state transition.
  //It is valid to move this logic into the reducer function. Now the 
  //reducer function has to cover this state in a conditional transition.
  //See (B) in storiesReducer
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  //Handler
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List
          list={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

export default App;
//========================================================== 
 //Note on Map:
 //Within the map() method, we have access to each object and its properties.
 
 //useState
 //By using useState, we are telling React that we want to have a 
 //stateful value which changes over time. And whenever this stateful value 
 //changes, the affected components (here: Search component) 
 //will re-render to use it (here: to display the recent value).

 /* 
     The filter() method takes a function 
        as an argument, which accesses each item in the array and returns /
        true or false. If the function returns true, meaning the condition is 
        met, the item stays in the newly created array; if the function 
        returns false, it's removed from the filtered array.

  
 */
 
 /*Note on Map:
   Within the map() method, we have access to each object and its properties.

 // concatenating variables into a string
    var fullName = `${firstName} ${lastName}`
    console.log(fullName);


 //useState
    By using useState, we are telling React that we want to have a 
 stateful value which changes over time. And whenever this stateful value 
 changes, the affected components (here: Search component) 
 will re-render to use it (here: to display the recent value).

  //Work flow of a useState:
       When the user types into the input field, the input field's change event 
      runs into the event handler. The handler's logic uses the event's value 
      of the target and the state updater function to set the updated state. 
      Afterward, the component re-renders (read: the component function runs). 
      The updated state becomes the current state (here: searchTerm) and is 
      displayed in the component's JSX.

  //Arrow Function
    function getTitle(title) { - convert to arrow function see below
    
    const getTitle =(title) => 
       (
        title
       );

    Eliminate bracket and "return" statement if no business logic before 
    the function - concise
   

  //Arrow function - 
   If there is a business business logic. Otherwise retain the {} and
   put a "return" statement 
     const App = () => {
       ...
       return xyz;
     } 
 
  //How to use a React.Reducer hook 
  To use Reducer (1) first define a reducer function.
     1. A reducer action is always associated with a type. As best 
        practice with a payload.
        Example:
          const storiesReducer = (state, action) =>{
          if (action.type === 'SET_STORIES'){
            //If the type matches a condition in the reducer. Return a new
            //state based on the incoming state and action
            return action.payload;
          }
          else{
          //throw an error if isn't covered by the reducer to remind yourself
          //that the implementation is not covered
            throw new Error();
          }
        }
      2. The second thing to do is to replaceReact.useState to use a reducer hook
         like this: 

          const [stories, dispatchStories] = React.useReducer(storiesReducer,[]);

          1. receives a reducer function called "storiesReducer"
          2. receives an initial state of empty array []
          3. returns an array with 2 item: 
            - The first item is "stories" which is the current state
            - The second item is the updater function named "dispatchStories"
            Unlike useState, the updater function of Reducer sets the state
            "implicitly" by dispatching an "action". Example:
               dispatchStories({
                 type: 'SET_STORIES',   <== this is the action
               payload: result.data.stories,
             });
       
 */