export const mockProject = (
	_id = 'a uuid',
	name = 'Projectname',
	description = 'description without description',
	user = 'userId',
) => ({
	_id,
	name,
	description,
	user,
});
