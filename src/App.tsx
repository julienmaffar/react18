/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEvent,
  Suspense,
  useCallback,
  useDeferredValue,
  useId,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { PostList } from "./components/PostList";
import { Loading } from "./components/Loading";

const getSnapshot = () => navigator.onLine;

const subscribe = (callback: any) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

const App = () => {
  // Génération d'id unique à chaque rendu du composant.
  const id = useId();
  const id2 = useId();
  const id3 = useId();

  // Utilisation du useSynExternalStore pour savoir si l'application est en ligne ou non.
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [input, setInput] = useState("");
  const [list, setList] = useState<string[]>([]);

  const [otherInput, setOtherInput] = useState("");
  const [otherList, setOtherList] = useState<string[]>([]);
  const deferredList = useDeferredValue(otherList);

  // Traitement par lot, il n'y aura qu'un seul rendu et non deux.
  const handleClick = useCallback(() => {
    setFirstname("Julien");
    setLastname("Maffar");
  }, []);

  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);

    // Le code à l'interieur de `startTransition` sera executé APRES le changement de l'input.
    startTransition(() => {
      const l = [];
      for (let i = 0; i < 20000; i++) {
        l.push(event.target.value);
      }
      setList(l);
    });
  }, []);

  const handleChangeList = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setOtherInput(event.target.value);
      const l = [];
      for (let i = 0; i < 20000; i++) {
        l.push(event.target.value);
      }
      setOtherList(l);
    },
    []
  );

  return (
    <>
      <div>
        Valeur des ids {id}, {id2}, {id3}.
      </div>
      <div>{isOnline ? "En ligne" : "Hors ligne"}</div>
      <div>
        {firstname} {lastname}
      </div>
      <button onClick={handleClick}>Changer le nom</button>
      <div>
        <input type='text' value={input} onChange={handleChange} />
        {isPending ? (
          <div>Chargement...</div>
        ) : (
          list.map((item, index) => <div key={index}>{item}</div>)
        )}
      </div>
      <div>
        <input type='text' value={otherInput} onChange={handleChangeList} />
        {deferredList.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
      <div>
        <div>Suspense</div>
        <Suspense fallback={<Loading />}>
          <PostList />
        </Suspense>
      </div>
    </>
  );
};

export default App;
