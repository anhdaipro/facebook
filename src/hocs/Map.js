const stateWithEntity = editorState1.getCurrentContent().createEntity(
  'mention',
  'SEGMENTED',
  {
    mention: {id: 1, name: '@foobar'},
  },
)
const entityKey = stateWithEntity.getLastCreatedEntityKey()
const stateWithText = Modifier.insertText(stateWithEntity, editorState1.getSelection(), 'foobar', null, entityKey)

const [editorState, setEditorState] = useState(() =>
EditorState.createWithContent(stateWithText)
);