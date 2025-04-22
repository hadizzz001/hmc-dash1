import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      img,
      price,
      location,
      category,
      type,
      bed,
      bath,
      size,
      condition,
      floor,
      amenities,
      age,
      ref,
    } = body;

    console.log("body are: ", body);

    const product = await prisma.real.create({
      data: {
        title,
        description,
        img,
        price,
        location,
        category,
        type,
        bed,
        bath,
        size,
        condition,
        floor,
        amenities,
        age,
        ref,
      },
    });

    return new Response(JSON.stringify({ message: 'Product created successfully', product }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: 'Failed to create product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req) {
  try {
    const products = await prisma.real.findMany();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  try {
    await prisma.real.deleteMany({});

    return new Response(JSON.stringify({ message: 'All products deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting products:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
