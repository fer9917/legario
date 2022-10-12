import { useState } from 'react';

import {
	IonCard,
	IonLabel,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonInput,
	IonItem,
	IonButton,
} from '@ionic/react';

import { Alert, api } from '../components/api';

const Login = () => {
	/* Hooks
	======================================== */
	const [datos, setDatos] = useState({
		password: '',
		email: '',
	});

	/* Functions
	======================================== */
	// Function that ejecute when the user write an input
	const updateData = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	}

	const submit = (e) => {
		e.preventDefault()

		if (datos.email === '' || datos.pass === '') {
			Alert("Debes llenar todos los campos")

			return;
		}

		console.log('submit', datos);

		api({
			...datos,
			url: 'login',
			type: 'post',
		}).then((res) => {
			console.log('res', res);

			if (!res) {
				// Show error
				Alert("Ocurrió un error, revisa la información.")

				return;
			}
			if (!res.token) {
				Alert("Ocurrió un error, revisa la información.")

				return;
			}

			// Limpia el formulario
			setDatos({
				password: '',
				email: '',
			})

			// Save user on local
			localStorage.setItem("_user", JSON.stringify({
				...res.user,
				token: res.token
			}));

			window.location.replace("/")
		}).catch((err) => {
			console.log('err', err);

			// Show error
			Alert("Ocurrió un error, revisa la información." + err)
		})
	}

	return (
		<div style={{ textAlign: 'center' }}>
			<IonCard>
				<IonCardHeader>
					<IonCardTitle>Iniciar sesión</IonCardTitle>
				</IonCardHeader>
				<IonCardContent style={{ textAlign: 'left' }}>
					<form onSubmit={e => submit(e)}>
						<IonItem>
							<IonLabel position="floating">Correo</IonLabel>
							<IonInput
								onIonChange={e => updateData(e)}
								placeholder="juan@algo.com"
								value={datos.email}
								name="email"
							/>
						</IonItem>
						<IonItem>
							<IonLabel position="floating">Contraseña</IonLabel>
							<IonInput
								value={datos.password}
								onIonChange={e => updateData(e)}
								type='password'
								name="password"
							/>
						</IonItem>
						<br />
						<IonButton fill="outline" color="primary" expand="block" type="submit">
							Iniciar sesión
						</IonButton>
					</form><br />
					<div style={{textAlign: 'center'}}>
						<a href="/recovery">Recuperar contraseña</a>
					</div><br />
					<div style={{textAlign: 'center'}}>
						<a href="/register">Registrarse</a>
					</div>
				</IonCardContent>
			</IonCard>
		</div>
	);
}

export default Login;
