import { useState, useEffect, useCallback } from 'react';
import {
	IonCard,
	IonCardHeader,
	IonCardContent,
	IonCardSubtitle,
	IonButton,
	IonItem,
	IonLabel,
} from '@ionic/react';

import { Alert, api, NoData } from '../components/api';

const PostComments = ({ post_id }) => {
	/* Hooks
	======================================== */
	const [comments, setComments] = useState()

	/* Functions
	======================================== */
	// Get comments desde la API
	const getComments = useCallback(() => {
		console.log('getComments')

		// Get API comments
		api({
			post_id: post_id,
			url: 'comments',
		}).then((resp) => {
			console.log('resp', resp);

			// Set comments
			if (resp.length > 0) setComments(resp)
		}).catch((err) => {
			// Show error
			Alert("Ocurrió un error, revisa la información." + err)
		})
	}, [])

	const createComment = () => {
		const local_user = localStorage.getItem("_user")
		if (!local_user) {
			Alert("No se detecto el usuario")

			return;
		}
		const user = JSON.parse(local_user)

		const comment = {
			user_id: user.id,
			post_id: post_id,
			content: '',
			id: '',
		}
		localStorage.setItem("_comment", JSON.stringify(comment));

		window.location.replace("/addComment")
	}

	/* Observers
	======================================== */
	useEffect(() => {
		if (!comments) getComments()
	}, [comments, getComments])

	return (<>
		<IonCard>
			<IonCardContent style={{ textAlign: 'left' }}>
				<IonButton expand="block" onClick={() => createComment()}>Agregar comentario</IonButton>
			</IonCardContent>
		</IonCard>
		{!comments ? <NoData /> : <>
			<IonCard>
				<IonCardContent>
				{comments.map((value, key) => {
					return (
						<IonItem key={'comment_'+key}>
							<IonLabel className="ion-text-wrap">
								{value.content}
							</IonLabel>
						</IonItem>
					)
				})}
				</IonCardContent>
			</IonCard>
			<IonCard>
				<IonCardContent style={{ textAlign: 'left' }}>
					<IonButton expand="block" onClick={() => createComment()}>Agregar comentario</IonButton>
				</IonCardContent>
			</IonCard>
		</>}
	</>);
};

export default PostComments;