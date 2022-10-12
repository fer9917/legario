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
	IonSelect,
	IonSelectOption,
} from '@ionic/react';

import { Alert, api } from '../components/api';

const AddComment = () => {
	let comment = {
		user_id: '',
		post_id: '',
		content: '',
		id: '',
	}
	const local_comment = localStorage.getItem("_comment")
	if (local_comment) {
		comment = JSON.parse(local_comment)
	}

	/* Hooks
	======================================== */
	const [data, setData] = useState(comment);

	/* Functions
	======================================== */
	// Function that ejecute when the user write an input
	const updateData = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	}

	const submit = (e) => {
		e.preventDefault()

		// Validations
		if (data.content === '' || data.title === '') {
			Alert("Debes llenar todos los campos")

			return;
		}
		const local_user = localStorage.getItem("_user")
		if (!local_user) {
			Alert("No se detecto el usuario")

			return;
		}

		// Build request
		const user = JSON.parse(local_user)
		let request = data
		request.type = (data.id) ? 'put' : 'post'
		request.user_id = user.id
		request.url = 'comments'

		api(request).then((res) => {
			console.log('res', res);

			if (!res) {
				// Show error
				Alert("Ocurrió un error, revisa la información.")

				return;
			}

			// Limpia el formulario
			setData({
				user_id: '',
				post_id: '',
				content: '',
				id: '',
			})

			localStorage.removeItem("_comment");

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
					<IonCardTitle>Agregar comentario</IonCardTitle>
				</IonCardHeader>
				<IonCardContent style={{ textAlign: 'left' }}>
					<form onSubmit={e => submit(e)}>
						<IonItem>
							<IonLabel position="floating">Comentario</IonLabel>
							<IonInput
								onIonChange={e => updateData(e)}
								placeholder="Contenido del comentario"
								value={data.content}
								name="content"
							/>
						</IonItem>
						<br />
						<IonButton fill="outline" color="primary" expand="block" type="submit">
							Guardar
						</IonButton>
					</form>
				</IonCardContent>
			</IonCard>
		</div>
	);
}

export default AddComment;
