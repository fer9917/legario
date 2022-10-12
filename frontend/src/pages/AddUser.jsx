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

const AddUser = () => {
	/* Hooks
	======================================== */
	const [datos, setDatos] = useState({
		password2: '',
		password: '',
		email: '',
		name: '',
		type: 0,
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

		if (datos.name === '' || datos.email === '' || datos.password === '' || datos.password2 === '') {
			Alert("Debes llenar todos los campos")

			return;
		}
		if (datos.password != datos.password2) {
			Alert("Las contraseñas no coinciden")

			return;
		}

		console.log('submit', datos);

		api({
			...datos,
			url: 'register',
			type: 'post',
		}).then((res) => {
			console.log('res', res);

			if (!res) {
				Alert("Ocurrió un error, revisa la información.")

				return;
			}
			if (!res.token) {
				Alert("Ocurrió un error, revisa la información.")

				return;
			}

			// Limpia el formulario
			setDatos({
				password2: '',
				password: '',
				email: '',
				name: '',
				type: 0,
			})

			// Save user on local
			localStorage.setItem("_user", JSON.stringify({
				...res.user,
				token: res.token,
				type: 0,
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
					<IonCardTitle>Registrarse</IonCardTitle>
				</IonCardHeader>
				<IonCardContent style={{ textAlign: 'left' }}>
					<form onSubmit={e => submit(e)}>
						<IonItem>
							<IonLabel position="floating">Nombre</IonLabel>
							<IonInput
								onIonChange={e => updateData(e)}
								placeholder="Juan Perez"
								value={datos.name}
								name="name"
							/>
						</IonItem>
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
								onIonChange={e => updateData(e)}
								value={datos.password}
								name="password"
								type='password'
							/>
						</IonItem>
						<IonItem>
							<IonLabel position="floating">Repetir contraseña</IonLabel>
							<IonInput
								onIonChange={e => updateData(e)}
								value={datos.password2}
								name="password2"
								type='password'
							/>
						</IonItem>
						<br />
						<IonButton fill="outline" color="primary" expand="block" type="submit">
							Registrarse
						</IonButton>
					</form><br />
					<div style={{textAlign: 'center'}}>
						<a href="/login">Iniciar sesión</a>
					</div>
				</IonCardContent>
			</IonCard>
		</div>
	);
}

export default AddUser;
