import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { ToastContainer, toast } from 'react-toastify';
import { IonReactRouter } from '@ionic/react-router';

// Components
import AddComment from './pages/AddComment';
import AddPost from './pages/AddPost';
import Posts from './pages/Posts';
import Recovery from './pages/Recovery';
import AddUser from './pages/AddUser';
import Login from './pages/Login';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
	toast.dismiss();

	return (
		<IonApp>
			<ToastContainer />
			<IonReactRouter>
				<IonRouterOutlet>
					<Route exact path="/"><Posts /></Route>
					<Route exact path="/addPost"><AddPost /></Route>
					<Route exact path="/addComment"><AddComment /></Route>
					<Route exact path="/login"><Login /></Route>
					<Route exact path="/register"><AddUser /></Route>
					<Route exact path="/recovery"><Recovery /></Route>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
}


export default App;
