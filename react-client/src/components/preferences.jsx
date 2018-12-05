import React from 'react'; 
import { ListGroup, ListGroupItem} from 'react-bootstrap';


const Preferences = ({prefs}) => (
	<ListGroup>
	{prefs.map(prefCategory => {
		return prefCategory.consumption_preferences.map(pref => {
			if (pref.score === 1) {
				return (
					<ListGroupItem key={pref.consumption_preference_id}>
						{pref.name}
					</ListGroupItem>
				);
			}
		});
	})}
</ListGroup>

)

export default Preferences;