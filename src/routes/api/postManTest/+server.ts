import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  return json({
    success: true,
    message: 'request successful'
  });
}