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

const AddPost = () => {
	let post = {
		user_id: '',
		content: '',
		title: '',
		status: 0,
		id: '',
	}
	const local_post = localStorage.getItem("_post")
	if (local_post) {
		post = JSON.parse(local_post)
	}

	/* Hooks
	======================================== */
	const [data, setData] = useState(post);

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
		request.url = 'posts'

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
				content: '',
				title: '',
				status: 0,
				id: '',
			})

			localStorage.removeItem("_posts");
			localStorage.removeItem("_post");

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
					<IonCardTitle>Agregar entrada</IonCardTitle>
				</IonCardHeader>
				<IonCardContent style={{ textAlign: 'left' }}>
					<form onSubmit={e => submit(e)}>
						{post.user_id === '' ? <></>:
							<IonItem>
								<IonLabel>Estado</IonLabel>
								<IonSelect
									onIonChange={e => updateData(e)}
									value={data.status}
									placeholder="Estado"
									required={true}
									name="status"
								>
									<IonSelectOption value={0}>Pendiente</IonSelectOption>
									<IonSelectOption value={1}>Aprobada</IonSelectOption>
									<IonSelectOption value={2}>Rechazada</IonSelectOption>
								</IonSelect>
							</IonItem>
						}
						<IonItem>
							<IonLabel position="floating">Titulo</IonLabel>
							<IonInput
								onIonChange={e => updateData(e)}
								placeholder="Titulo de la entrada"
								value={data.title}
								name="title"
							/>
						</IonItem>
						<IonItem>
							<IonLabel position="floating">Contenido</IonLabel>
							<IonInput
								onIonChange={e => updateData(e)}
								placeholder="Contenido de la entrada"
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

export default AddPost;
